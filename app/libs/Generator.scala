package com.dohzya.gethomeback.libs

import com.dohzya.gethomeback.models.{ Game, Player }

object Generator {

  def apply(x: Int, y: Int, game: Int, kind: Int): Double = {
    val nbs = List(
      SimplexNoise.noise(game, kind, x-2, y-2),
      SimplexNoise.noise(game, kind, x-1, y-1),
      SimplexNoise.noise(game, kind, x-1, y),
      SimplexNoise.noise(game, kind, x-1, y+1),
      SimplexNoise.noise(game, kind, x-2, y+2),
      SimplexNoise.noise(game, kind, x, y-1),
      SimplexNoise.noise(game, kind, x, y),
      SimplexNoise.noise(game, kind, x, y+1),
      SimplexNoise.noise(game, kind, x+1, y-1),
      SimplexNoise.noise(game, kind, x+2, y-2),
      SimplexNoise.noise(game, kind, x+1, y),
      SimplexNoise.noise(game, kind, x+1, y+1),
      SimplexNoise.noise(game, kind, x+2, y+2)
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

  def genSeed(player: Player): Int =
    genSeed(player.name)

  def genSeed(game: Game): Int =
    genSeed(game.name)

}
