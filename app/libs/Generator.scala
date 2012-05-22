package com.dohzya.gethomeback.libs

import com.dohzya.gethomeback.models._

object Generator {

  def noise(a: Int, b: Int, c: Int, d: Int) =
    SimplexNoise.noise(a, b, c, d)

  def apply(x: Int, y: Int, game: Int, kind: Int): Double = {
    val nbs = List(
      noise(game, kind, x-2, y-2),
      noise(game, kind, x-1, y-1),
      noise(game, kind, x-1, y),
      noise(game, kind, x-1, y+1),
      noise(game, kind, x-2, y+2),
      noise(game, kind, x, y-1),
      noise(game, kind, x, y),
      noise(game, kind, x, y+1),
      noise(game, kind, x+1, y-1),
      noise(game, kind, x+2, y-2),
      noise(game, kind, x+1, y),
      noise(game, kind, x+1, y+1),
      noise(game, kind, x+2, y+2)
    )
    nbs.reduce(_+_) / nbs.size
  }

  def apply(game: Game, kind: Int)(x: Int, y: Int): Double =
    Generator(x, y, genSeed(game), kind)

  def apply(game: String)(kind: Int)(x: Int, y: Int): Double =
    Generator(x, y, genSeed(game), kind)


  def genSeed(str: String): Int =
    str.foldLeft(0)((t,c) => t+c)

  def genSeed(max: Int = 1000000): Int =
    new java.util.Random(System.currentTimeMillis()).nextInt(max)

  def genSeed(player: Player.Infos): Int =
    genSeed(player.name)

  def genSeed(game: Game): Int =
    genSeed(game.name)

}
