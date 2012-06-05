package com.dohzya.getbackhome.models.messages

import com.dohzya.getbackhome.models._

trait Request
case object GetInfos extends Request
case object GetInstances extends Request
case class GetInstance(name: String) extends Request
case class CreateGame(name: String, zoneDims: Dimension = Dimension(1000, 1000)) extends Request
case class CreatePlayer(name: String) extends Request

trait Response
