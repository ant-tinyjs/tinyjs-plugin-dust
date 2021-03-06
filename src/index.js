/**
 * Dust - The TinyJS plugin
 *
 * Copy to https://github.com/kittykatattack/dust
 * Some code (c) 2017 kittykatattack
 *
 * @name        tinyjs-plugin-dust
 * @overview    Dust is a quick and easy particle effects engine
 * @author      yiiqii
 * @license     MIT
 */

/**
 * Tiny.js
 * @external Tiny
 * @see {@link http://tinyjs.net/}
 */

/**
 * Dust is a quick and easy particle effects engine
 *
 * @see https://github.com/kittykatattack/dust
 *
 * @class Dust
 */
class Dust {
  /**
   *
   * @param x
   * @param y
   * @param spriteFn
   * @param container
   * @param options
   */
  constructor(x, y, spriteFn, container, options) {
    this.x = x || 0;
    this.y = y || 0;
    this.spriteFn = spriteFn;
    this.container = container || new Tiny.Container();

    if (!spriteFn) {
      throw new Error('Sprite is needed.');
    }

    options = options || {};

    this.number = options.number || 20;
    this.gravity = options.gravity || 0;
    this.randomSpacing = Tiny.isUndefined(options.randomSpacing) ? true : options.randomSpacing;
    this.minAngle = options.minAngle || 0;
    this.maxAngle = options.maxAngle || 6.28;
    this.minSize = options.minSize || 4;
    this.maxSize = options.maxSize || 16;
    this.minSpeed = options.minSpeed || 0.3;
    this.maxSpeed = options.maxSpeed || 3;
    this.minScaleSpeed = options.minScaleSpeed || 0.01;
    this.maxScaleSpeed = options.maxScaleSpeed || 0.05;
    this.minAlphaSpeed = options.minAlphaSpeed || 0.02;
    this.maxAlphaSpeed = options.maxAlphaSpeed || 0.02;
    this.minRotationSpeed = options.minRotationSpeed || 0.01;
    this.maxRotationSpeed = options.maxRotationSpeed || 0.03;

    //An array to store the curent batch of particles
    this.particles = [];

    //An array to store the angles
    this.angles = [];

    const self = this;
    //A variable to store the current particle's angle
    let angle;

    //Figure out by how many radians each particle should be separated
    const spacing = (this.maxAngle - this.minAngle) / (this.number - 1);

    //Add the current `particles` array to the `globalParticles` array
    Dust.globalParticles.push(this.particles);

    //Create an angle value for each particle and push that //value into the `angles` array
    for (let i = 0; i < this.number; i++) {
      //If `randomSpacing` is `true`, give the particle any angle
      //value between `minAngle` and `maxAngle`
      if (this.randomSpacing) {
        angle = Tiny.randomFloat(this.minAngle, this.maxAngle);
        this.angles.push(angle);
      } else {
        //If `randomSpacing` is `false`, space each particle evenly,
        //starting with the `minAngle` and ending with the `maxAngle`
        if (angle === undefined) {
          angle = this.minAngle;
        }
        this.angles.push(angle);
        angle += spacing;
      }
    }

    //Make a particle for each angle
    this.angles.forEach(function(angle) {
      return self.makeParticle(angle);
    });
  }

  /**
   *
   * @param angle
   */
  makeParticle(angle) {
    //Create the particle using the supplied sprite function
    const particle = this.spriteFn();
    const gravity = this.gravity;
    const particles = this.particles;
    const container = this.container;

    //Display a random frame if the particle has more than 1 frame
    if (particle.totalFrames > 0) {
      particle.gotoAndStop(Tiny.randomInt(0, particle.totalFrames - 1));
    }

    //Set a random width and height
    const size = Tiny.randomInt(this.minSize, this.maxSize);
    particle.width = size;
    particle.height = size;

    //Set the particle's `anchor` to its center
    //particle.anchor.set(0.5, 0.5);

    //Set the x and y position
    particle.x = this.x;
    particle.y = this.y;

    //Set a random speed to change the scale, alpha and rotation
    particle.scaleSpeed = Tiny.randomFloat(this.minScaleSpeed, this.maxScaleSpeed);
    particle.alphaSpeed = Tiny.randomFloat(this.minAlphaSpeed, this.maxAlphaSpeed);
    particle.rotationSpeed = Tiny.randomFloat(this.minRotationSpeed, this.maxRotationSpeed);

    //Set a random velocity at which the particle should move
    const speed = Tiny.randomFloat(this.minSpeed, this.maxSpeed);
    particle.vx = speed * Math.cos(angle);
    particle.vy = speed * Math.sin(angle);

    //Push the particle into the `particles` array.
    //The `particles` array needs to be updated by the game loop each frame particles.push(particle);
    particles.push(particle);

    //Add the particle to its parent container
    container.addChild(particle);

    //The particle's `updateParticle` method is called on each frame of the
    //game loop
    particle.updateParticle = function() {
      //Add gravity
      particle.vy += gravity;

      //Move the particle
      particle.x += particle.vx;
      particle.y += particle.vy;

      //Change the particle's `scale`
      if (particle.scale.x - particle.scaleSpeed > 0) {
        particle.scale.x -= particle.scaleSpeed;
      }
      if (particle.scale.y - particle.scaleSpeed > 0) {
        particle.scale.y -= particle.scaleSpeed;
      }

      //Change the particle's rotation
      particle.rotation += particle.rotationSpeed;

      //Change the particle's `alpha`
      particle.alpha -= particle.alphaSpeed;

      //Remove the particle if its `alpha` reaches zero
      if (particle.alpha <= 0) {
        container.removeChild(particle);
        particles.splice(particles.indexOf(particle), 1);
      }
    };
  }

  /**
   *
   */
  update() {
    //Check so see if the `globalParticles` array contains any
    //sub-arrays
    if (Dust.globalParticles.length > 0) {
      //If it does, Loop through the particle arrays in reverse
      for (let i = Dust.globalParticles.length - 1; i >= 0; i--) {
        //Get the current particle sub-array
        const particles = Dust.globalParticles[i];

        //Loop through the `particles` sub-array and update the
        //all the particle sprites that it contains
        if (particles.length > 0) {
          for (let j = particles.length - 1; j >= 0; j--) {
            const particle = particles[j];
            particle.updateParticle();
          }
        } else {
          //Remove the particle array from the `globalParticles` array if doesn't
          //contain any more sprites
          Dust.globalParticles.splice(Dust.globalParticles.indexOf(particles), 1);
        }
      }
    }
  }
}

Dust.globalParticles = [];

module.exports = Dust;
