package utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedList;
import java.util.List;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import play.Logger;
import play.libs.WS;

public class DatabaseUtils {
	private final static String SERVER = "geoblaster.info";
	private final static String DATABASE = "crime";
	private final static String PASSWORD = "MacsEdgar2155";
	private final static String USER = "dunawayjenckes";
	private static String URL = "jdbc:postgresql://"+SERVER+":5432/"+DATABASE+"?user="+USER+"&password="+PASSWORD;

	public static Connection getConnection(){
		try {
			return DriverManager.getConnection(URL);
		} catch (SQLException e) {
			Logger.info("error making connection!!! %s", e);
		}
		return null;
	}

	public static String url = "http://www.adfg.alaska.gov/index.cfm?adfg=huntingmaps.find_hunt&huntnum=$huntId$";

	public static void main(String[] args) throws SQLException, InterruptedException{

		Connection conn = getConnection();
		ResultSet rs = conn.prepareStatement("Select distinct hunt from hunts_join_join").executeQuery();
		
		while(rs.next()){
			String hunt = rs.getString(1);
			
			WS.url(url.replace("$huntId$", hunt));
			
			
		}


		conn.close();

	}

}