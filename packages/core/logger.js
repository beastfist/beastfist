import consola from 'consola'

const logger = consola.create({
    // level: 4,
    reporters: [
      new consola.JSONReporter()
    ],
    defaults: {
      additionalColor: 'white'
    }
})
export default logger