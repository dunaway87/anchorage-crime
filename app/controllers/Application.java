package controllers;

import play.*;
import play.mvc.*;
import play.vfs.VirtualFile;
import utils.DatabaseUtils;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

import org.apache.commons.lang.StringUtils;
import org.geotools.geojson.geom.GeometryJSON;



import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;



public class Application extends Controller {

	public static void index() {
		render();
	}

	public static void getCrimeGeoJson(String year, int crimetype) throws SQLException {
		if(StringUtils.isEmpty(year) || year.equals("undefined")){
			year = "2010";
		}
		if(crimetype ==0 ) {
			crimetype = 16;
		}


		Connection conn =  DatabaseUtils.getConnection();

		String sql = "Select lat,lon from crime where classification="+crimetype+" and extract(year from date) = "+year;
		Logger.info("sql:  %s", sql);

		ResultSet rs = conn.prepareStatement(sql).executeQuery();

		JsonArray all = new JsonArray();

		while(rs.next()) {
			JsonObject obj = new JsonObject();
			double lat = rs.getDouble(1);
			double lng = rs.getDouble(2);
			obj.addProperty("lat", lat);
			obj.addProperty("lng", lng);
			obj.addProperty("count", 1);;
			all.add(obj);
		}
		conn.close();

		renderJSON(all);
	}


	public static void getFilters() throws SQLException {
		Connection conn =  DatabaseUtils.getConnection();

		JsonObject filters = new JsonObject();
		try {

			JsonObject year = new JsonObject();


			ResultSet rs = conn.prepareStatement("Select distinct year from year order by year desc").executeQuery();
			year.addProperty("type", "or");
			JsonArray yearRange = new JsonArray();

			while(rs.next()) {
				JsonObject item = new JsonObject();
				item.addProperty("label", rs.getString(1));
				item.addProperty("value", rs.getString(1));
				yearRange.add(item);
			}
			year.add("range", yearRange);



			rs = conn.prepareStatement("Select id,type from code where display = true order by order_column asc").executeQuery();

			JsonObject code = new JsonObject();
			code.addProperty("type", "or");
			JsonArray codeRange = new JsonArray();

			while(rs.next()) {
				JsonObject item = new JsonObject();
				item.addProperty("label", rs.getString(2));
				item.addProperty("value", rs.getString(1));
				codeRange.add(item);
			}
			code.add("range", codeRange);
			filters.add("year", year);
			filters.add("code", code);
		} catch(Exception e) {
			e.printStackTrace();
		}finally {
			conn.close();
		}
		renderJSON(filters);
	}

	public static void getPolygonData(Integer year, Integer crime, String polygon){
		Connection conn = new DatabaseUtils().getConnection();
		JsonObject obj = new JsonObject();
		JsonArray array = new JsonArray();
		String[] coords = polygon.split(",");
		String lastCoord = coords[0];
		polygon= polygon+","+ lastCoord;
		
		try{
			String sql = "Select count(*), extract(year from date)  from crime where ST_Contains(ST_SetSrid(ST_GeomFromText('Polygon(("+polygon+"))'),4326), geom) and classification = "+crime+"and extract(year from date) >2009 group by extract(year from date) order by extract(year from date)  asc";
			Logger.info(sql);
			ResultSet rs = conn.prepareStatement(sql).executeQuery();
			JsonArray years = new JsonArray();
			JsonArray values = new JsonArray();
			
			while(rs.next()){
				int count = rs.getInt(1);
				String currentYear = rs.getString(2);
/*				JsonObject current = new JsonObject();
				current.addProperty(currentYear, count);
				array.add(current);*/
				years.add(currentYear);
				values.add(count);
				
				
			}
			
			obj.add("years", years);
			obj.add("values", values);
			
		} catch (Exception e){
			Logger.error(e, "Error in getting polygon data");
		} finally {
			try {
				conn.close();
			} catch (SQLException e) {
				Logger.error(e, "error closing connection");
			}
		}
		
		
		renderJSON(obj);
	}

}




