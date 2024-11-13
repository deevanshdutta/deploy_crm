// Simulated message sending service
export const sendMessage = async (email, message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 90% success rate
      const success = Math.random() < 0.9;
      resolve({
        status: success ? 'SENT' : 'FAILED',
        email,
        message,
      });
    }, 500);
  });
};