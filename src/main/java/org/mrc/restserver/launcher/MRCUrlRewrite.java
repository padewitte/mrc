package org.mrc.restserver.launcher;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.camel.Producer;
import org.apache.camel.component.http.UrlRewrite;

public class MRCUrlRewrite implements UrlRewrite {

	private Map<String, String> rewriteRules = new HashMap<String, String>();
	private MRCServerBean contentServer;

	public MRCUrlRewrite(MRCServerBean contentServer,
			List<MRCServerBean> otherServers) {
		for (MRCServerBean server : otherServers) {
			rewriteRules.put(server.getDefaultContext(),
					"" + server.getListenPort());
		}
		this.contentServer = contentServer;
	}

	public String rewrite(String url, String relativeUrl, Producer producer)
			throws Exception {
		String ret = null;
		for (Entry<String, String> rule : rewriteRules.entrySet()) {
			if (url.matches("http://.*" + (contentServer.getListenPort()) + "/"
					+ rule.getKey() + ".*")) {
				ret = url.replace(":" + (contentServer.getListenPort()) + "/"
						+ rule.getKey(), ":" + rule.getValue() + "/");
			} else if (url.contains("/" + rule.getKey())) {
				ret = url.replace("/" + rule.getKey(), ":" + rule.getValue()
						+ "/");
			}
		}
		return ret;
	}

}
