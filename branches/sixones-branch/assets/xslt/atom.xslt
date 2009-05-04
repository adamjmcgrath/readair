<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:gr="http://www.google.com/schemas/reader/atom/" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

<xsl:output method="xml" omit-xml-declaration="yes" indent="yes" />

<xsl:template match="/atom:feed">
	<xsl:apply-templates select="atom:entry"/>
</xsl:template>

<xsl:template match="atom:entry">
	<xsl:element name="tr">
		<xsl:choose>
			<xsl:when test="atom:category[@label='read'] and atom:category[@label='starred']">
				<xsl:attribute name="class">read starred</xsl:attribute>
			</xsl:when>
			<xsl:otherwise>
				<xsl:if test="atom:category[@label='read']">
					<xsl:attribute name="class">read</xsl:attribute>
				</xsl:if>
				<xsl:if test="atom:category[@label='starred']">
					<xsl:attribute name="class">starred</xsl:attribute>
				</xsl:if>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:attribute name="id"><xsl:value-of select="atom:id" /></xsl:attribute>
		<td class="readTD">readTD</td>
		<td class="star">starTD</td>
		<td><xsl:value-of select="atom:title" /></td>
		<td><xsl:value-of select="atom:source/atom:title" /></td>
		<td><xsl:value-of select="substring(atom:published, 0, 11)" /></td>
	</xsl:element>
</xsl:template>

</xsl:stylesheet>
