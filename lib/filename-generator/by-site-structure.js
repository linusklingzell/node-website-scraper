import _ from 'lodash';
import path from 'path';
import url from 'url';
import {getHostFromUrl, getFilepathFromUrl, getFilenameExtension} from '../utils/index.js';
import resourceTypes from '../config/resource-types.js';
import resourceTypeExtensions from '../config/resource-ext-by-type.js';

export default function generateFilename (resource, {defaultFilename}) {
	const resourceUrl = resource.getUrl();
	const host = getHostFromUrl(resourceUrl);
	const urlParsed = url.parse(resourceUrl);
	let filePath = getFilepathFromUrl(resourceUrl);
	const extension = getFilenameExtension(filePath);

	filePath = path.join(host, filePath);

	// If we have HTML from 'http://example.com/path' => set 'path/index.html' as filepath
	if (resource.isHtml()) {
		const htmlExtensions = resourceTypeExtensions[resourceTypes.html];
		const resourceHasHtmlExtension = _.includes(htmlExtensions, extension);
		// add index.html only if filepath has ext != html '/path/test.com' => '/path/test.com/index.html'
		if (!resourceHasHtmlExtension) {
			if (!urlParsed.query) {
				// Without query string: http://example.com/path => path/index.html
				filePath = path.join(filePath, defaultFilename);
			} else {
				// With query string: http://example.com/path?q=test => path/q=test.html
				filePath = `${filePath}.html`;
			}
		}
	}

	return filePath;
}
