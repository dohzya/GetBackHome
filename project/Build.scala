import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

  val appName         = "GetBackHome"
  val appVersion      = "1.0-SNAPSHOT"

  val appDependencies = Seq(
    "org.reactivemongo" %% "reactivemongo" % "0.10.0-SNAPSHOT",
    "org.reactivemongo" %% "play2-reactivemongo" % "0.10.0-SNAPSHOT"
  )

  val sonatypeRepos = Seq(
    "Sonatype releases" at "http://oss.sonatype.org/content/repositories/releases/",
    "Sonatype snapshots" at "http://oss.sonatype.org/content/repositories/snapshots/"
  )


  val main = play.Project(appName, appVersion, appDependencies).settings(
    resolvers ++= sonatypeRepos
  )

}
