export function promiseWithTimeout(promise, timeout) {
  let timeoutId; 
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('Promise timed out'));
    }, timeout);
  })
  return Promise.race([promise, timeoutPromise]);
};

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}