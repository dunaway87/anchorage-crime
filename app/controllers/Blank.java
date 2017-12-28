package controllers;

import play.mvc.Controller;

/**
 * prepares blank page for client-side templating
 */
public class Blank extends Controller {

	public static void index() {
		ControllerArgs.setRenderArgs();

		render();
	}

}
