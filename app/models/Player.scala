package com.dohzya.gethomeback.models

case class Player(
  name: String,
) {

  def infos = Infos(name)

}
object Player {

  case class Infos(name: String)

}
