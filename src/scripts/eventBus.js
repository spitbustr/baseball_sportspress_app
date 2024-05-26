import emitter from 'tiny-emitter/instance';

const EventBusPlugin = {
  install(app) {
    app.config.globalProperties.events = {
      $on: (...args) => emitter.on(...args),
      $once: (...args) => emitter.once(...args),
      $off :(...args) => emitter.off(...args),
      $emit: (...args) => emitter.emit(...args),
    }
  }
};

export default EventBusPlugin;