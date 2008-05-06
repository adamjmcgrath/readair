<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="xml" omit-xml-declaration="yes" version="1.0" encoding="utf-8" indent="yes"/>

<xsl:key name="feeds-by-label" match="list/object/list/object" use="string[@name='label']" />

<xsl:template match="object">
	<ul>
		<xsl:apply-templates select="list/object/list/object[count(. | key('feeds-by-label', string[@name='label'])[1]) = 1][string[@name='label']]" mode="tag">
			<xsl:sort select="list/object/string[@name='label']" />
		</xsl:apply-templates>
		<xsl:apply-templates select="list/object[list[not(node())]]" mode="feed">
			<xsl:sort select="string[@name='title']" />
		</xsl:apply-templates>
	</ul>
</xsl:template>

<xsl:template match="object" mode="tag">
	<li>
		<div href="{string[@name='id']}" class="folder">
			<img src="assets/img/icons/arrow-right.png" width="10" height="10" class="right" />
			<img src="assets/img/icons/arrow-down.png" width="10" height="10" class="down" />
			<img src="assets/img/icons/folder.png" width="16" height="16" />
			<xsl:value-of select="string[@name='label']" />
			<span></span>
		</div>
		<ul>			
			<xsl:variable name="tagname"><xsl:value-of select="string[@name='label']" /></xsl:variable>
			<ul>
				<xsl:apply-templates select="/object/list/object[list/object/string[@name='label'] = $tagname]" mode="feed">
					<xsl:sort select="string[@name='title']" />
				</xsl:apply-templates>
			</ul>
		</ul>
	</li>
</xsl:template>

<xsl:template match="object" mode="feed">
	<li>
		<!-- <div class="{translate(string[@name='id'],'?','')}"> -->
		<div href="{string[@name='id']}">
			<img src="/assets/img/icons/default.png" width="16" height="16" class="favicon" />
			<xsl:value-of select="substring(string[@name='title'],1,17)" />
			<xsl:if test="string-length(string[@name='title']) &gt; 17">...</xsl:if>
			<span></span>
		</div>
	</li>
</xsl:template>

</xsl:stylesheet>