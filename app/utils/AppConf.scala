package utils

import play.api.Configuration

case class AppConf(config: Configuration) {
  val APPCONF_PREFIX = "application."
  def getKey(value: String): String = APPCONF_PREFIX + value

  val NAME = "name"
  val VERSION = "version"
  val STAGE = "stage"
  val STYLES_MIN = "styles.min"
  val SCRIPTS_MIN = "scripts.min"
  val LIVERELOAD = "livereload"

  lazy val name: String = config.getString(getKey(NAME)).getOrElse("???AppName???")
  lazy val version: String = config.getString(getKey(VERSION)).getOrElse("1.0.0")
  lazy val stage: String = config.getString(getKey(STAGE)).getOrElse("PRD")
  lazy val stylesMin: Boolean = config.getBoolean(getKey(STYLES_MIN)).getOrElse(true)
  lazy val scriptsMin: Boolean = config.getBoolean(getKey(SCRIPTS_MIN)).getOrElse(true)
  lazy val livereload: Boolean = config.getBoolean(getKey(LIVERELOAD)).getOrElse(false)
}
