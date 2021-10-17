class Dwj {
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'

  constructor(executor) {
    this.status = Dwj.PENDING
    this.result = null
    this.callbacks = [] // 执行器那里是异步的
    try {
      executor(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      this.reject(error)
    }
  }

  resolve(value) {
    if (this.status === Dwj.PENDING) {
      this.status = Dwj.FULFILLED
      this.result = value
      // this.callbacks[0](value)
      setTimeout(() => {
        this.callbacks.map((callback) => callback.onFulfilled(value))
      })
    }
  }

  reject(error) {
    if (this.status === Dwj.PENDING) {
      this.status = Dwj.REJECTED
      this.result = error
      // this.callbacks[1](error)
      setTimeout(() => {
        this.callbacks.map((callback) => callback.onRejected(error))
      })
    }
  }

  then(onFulfilled, onRejected) {
    if (typeof onFulfilled !== 'function') onFulfilled = () => {}
    if (typeof onRejected !== 'function') onRejected = () => {}

    if (this.status === Dwj.PENDING) {
      // this.callbacks.push(onFulfilled, onRejected)
      this.callbacks.push({
        onFulfilled: (value) => {
          try {
            onFulfilled(value)
          } catch (error) {
            onRejected(error)
          }
        },
        onRejected: (value) => {
          try {
            onRejected(value)
          } catch (error) {
            onRejected(error)
          }
        },
      })
    }

    if (this.status === Dwj.FULFILLED) {
      setTimeout(() => {
        try {
          onFulfilled(this.result)
        } catch (error) {
          onRejected(error)
        }
      })
    }

    if (this.status === Dwj.REJECTED) {
      setTimeout(() => {
        try {
          onRejected(this.result)
        } catch (error) {
          onRejected(error)
        }
      })
    }
  }
}
