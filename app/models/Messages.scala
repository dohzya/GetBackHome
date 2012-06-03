package com.dohzya.gethomeback.models.messages

import com.dohzya.gethomeback.models._

trait Request
case object GetInfos extends Request
case class GetInstance(name: String) extends Request
case class CreateGame(name: String, zoneDims: Dimension = Dimension(1000, 1000)) extends Request
case class CreatePlayer(name: String) extends Request

trait Response
