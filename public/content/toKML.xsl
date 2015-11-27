<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
	xmlns:rss="http://purl.org/rss/1.0/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:syn="http://purl.org/rss/1.0/modules/syndication/"
	xmlns="http://www.w3.org/1999/xhtml"
	version="1.0">
	<xsl:output indent="yes"/>
	<xsl:template match="gpspositions">
		<kml xmlns="http://www.opengis.net/kml/2.2">
		  <Document>
		    <name>KmlFile</name>
		    <Style id="transPurpleLineGreenPoly">
		      <LineStyle>
		        <color>7fff00ff</color>
		        <width>4</width>
		      </LineStyle>
		      <PolyStyle>
		        <color>7f00ff00</color>
		      </PolyStyle>
		    </Style>
		    <Placemark>
		      <name>Absolute</name>
		      <visibility>1</visibility>
		      <description>Transparent purple line</description>
		      <styleUrl>#transPurpleLineGreenPoly</styleUrl>
		      <LineString>
		        <tessellate>1</tessellate>
		        <altitudeMode>absolute</altitudeMode>
		        <coordinates>
		        	<xsl:for-each select="gps">
		        		<xsl:value-of select="longitude"/>,<xsl:value-of select="latitude"/>,0
		        	</xsl:for-each>
		        </coordinates>
		      </LineString>
		    </Placemark>
		  </Document>
		</kml>
	</xsl:template>
</xsl:stylesheet>