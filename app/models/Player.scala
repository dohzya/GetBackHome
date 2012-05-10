package com.dohzya.gethomeback.models

case class Player(
  name: String,
  zones: Seq[Zone]
)
object Player {

  def apply(name: String): Player = Player(name, List[Zone]())

}
