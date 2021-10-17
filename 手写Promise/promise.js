class Dwj {
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'

  constructor(executor) {
    this.status = Dwj.PENDING
    this.result = null
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
    }
  }

  reject(error) {
    if (this.status === Dwj.PENDING) {
      this.status = Dwj.REJECTED
      this.result = error
    }
  }

  then(onFulfilled, onRejected) {
    if (typeof onFulfilled !== 'function') onFulfilled = () => {}
    if (typeof onRejected !== 'function') onRejected = () => {}
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
