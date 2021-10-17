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

    return new Dwj((resolve, reject) => {
      if (this.status === Dwj.PENDING) {
        // this.callbacks.push(onFulfilled, onRejected)
        this.callbacks.push({
          onFulfilled: (value) => {
            try {
              const res = onFulfilled(value)
              if (res instanceof Dwj) {
                res.then(resolve, reject)
              } else {
                resolve(res)
              }
            } catch (error) {
              reject(error)
            }
          },
          onRejected: (value) => {
            try {
              const res = onRejected(value)
              if (res instanceof Dwj) {
                res.then(resolve, reject)
              } else {
                resolve(res)
              }
            } catch (error) {
              reject(error)
            }
          },
        })
      }

      if (this.status === Dwj.FULFILLED) {
        setTimeout(() => {
          try {
            const res = onFulfilled(this.result)
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
        })
      }

      if (this.status === Dwj.REJECTED) {
        setTimeout(() => {
          try {
            const res = onRejected(this.result)
            if (res instanceof Dwj) {
              res.then(resolve, reject)
            } else {
              resolve(res)
            }
          } catch (error) {
            reject(error)
          }
        })
      }
    })
  }
}
