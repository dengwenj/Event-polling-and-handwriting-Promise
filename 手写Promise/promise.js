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
    if (typeof onFulfilled !== 'function') onFulfilled = () => this.result
    if (typeof onRejected !== 'function') onRejected = this.result

    let promise = new Dwj((resolve, reject) => {
      if (this.status === Dwj.PENDING) {
        // this.callbacks.push(onFulfilled, onRejected)
        this.callbacks.push({
          onFulfilled: (value) => {
            this.parse(promise, onFulfilled(value), resolve, reject)
          },
          onRejected: (value) => {
            this.parse(promise, onRejected(value), resolve, reject)
          },
        })
      }

      if (this.status === Dwj.FULFILLED) {
        setTimeout(() => {
          this.parse(promise, onFulfilled(this.result), resolve, reject)
        })
      }

      if (this.status === Dwj.REJECTED) {
        setTimeout(() => {
          this.parse(promise, onRejected(this.result), resolve, reject)
        })
      }
      return promise
    })
  }

  parse(promise, res, resolve, reject) {
    if (promise === res) {
      throw new TypeError('Chaining cycle detected')
    }
    try {
      if (res instanceof Dwj) {
        res.then(resolve, reject)
      } else {
        resolve(res)
      }
      // then 返回 Promise 对象处理，返回的这个 Promise 对象的状态就是这个 res 的状态
      // if (res instanceof Dwj) {
      //   res.then(
      //     (value) => {
      //       resolve(value)
      //     },
      //     (error) => {
      //       reject(error)
      //     }
      //   )
      // } else {
      //   resolve(res)
      // }
    } catch (error) {
      reject(error)
    }
  }

  static resolve(value) {
    return new Dwj((resolve, reject) => {
      if (value instanceof Dwj) {
        value.then(resolve, reject)
      } else {
        resolve(value)
      }
    })
  }

  static reject(value) {
    return new Dwj((resolve, reject) => {
      reject(value)
    })
  }
}
