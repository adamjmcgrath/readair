<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
	<xsl:output method="html" indent="yes"/>
	<xsl:template match="/">
		<div>
			<xsl:apply-templates />
		</div>
	</xsl:template>
	<xsl:template match="*">
		<div class="TOD_element">
			<span class="TOD_expandButton" onclick="theApplication.toggleDebugElm(this);">-</span>
			<span class="TOD_startOpenBracket">&lt;</span>
			<span class="TOD_startElementName">
				<xsl:value-of select="name()"/>
			</span>
			<xsl:apply-templates select="@*"/>
			<span class="TOD_endOpenBracket">&gt;</span>
			<span class="TOD_content">
				<xsl:apply-templates/>
			</span>
			<xsl:choose>
				<xsl:when test="count(*)">
					<span class="TOD_startCloseBracket">&lt;/</span>
				</xsl:when>
				<xsl:otherwise>
					<span class="TOD_leafStartCloseBracket">&lt;/</span>
				</xsl:otherwise>
			</xsl:choose>
			<span class="TOD_endElementName">
				<xsl:value-of select="name()"/>
			</span>
			<span class="TOD_endCloseBracket">&gt;</span>
		</div>
	</xsl:template>
	<xsl:template match="@*">
		<xsl:text> </xsl:text>
		<span class="TOD_attrName">
			<xsl:value-of select="name()"/>
		</span>
		<span class="TOD_attrEquals">
			<xsl:text>=</xsl:text>
		</span>
		<span class="TOD_openAttrQuote">
			<xsl:text>"</xsl:text>
		</span>
		<span class="TOD_attrValue">
			<xsl:value-of select="."/>
		</span>
		<span class="TOD_closeAttrQuote">
			<xsl:text>"</xsl:text>
		</span>
	</xsl:template>
	<xsl:template match="comment()">
		<div class="TOD_comment">
			<xsl:text>&lt;!-- </xsl:text>
			<xsl:value-of select="."/>
			<xsl:text> --&gt;</xsl:text>
		</div>
	</xsl:template>
	<xsl:template match="processing-instruction()">
		<div class="TOD_pi">
			<xsl:text>&lt;?</xsl:text>
			<xsl:value-of select="name()"/>
			<xsl:text> </xsl:text>
			<xsl:value-of select="."/>
			<xsl:text>?&gt;</xsl:text>
		</div>
	</xsl:template>
</xsl:stylesheet>
