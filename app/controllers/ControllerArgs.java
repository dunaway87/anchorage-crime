package controllers;

import org.apache.commons.lang.StringUtils;

import play.Logger;
import play.Play;
import play.mvc.Http.Request;
import play.mvc.Scope;
import play.mvc.Scope.RenderArgs;

public abstract class ControllerArgs {

	public static void setRenderArgs() {
		RenderArgs renderArgs = Scope.RenderArgs.current();

		renderArgs.put("minify", getMinifySetting());
	
		Logger.info("initView route: %s", getRoute());
	}

	public static String getRoute() {
		return StringUtils.strip( Request.current().path, "/" );
	}

	public static boolean getMinifySetting() {
		Boolean minify = Boolean.valueOf(Scope.Params.current().get("minify"));

		if (minify != null && minify) {
			return minify;
		}

		String mode = Play.id;
		if (mode.equals("prod") || mode.equals("staging") || mode.equals("docker")) {
			return true;
		} else return false;
	}

}
