export const mockContract = {
  register: async () => {
    return new Promise(resolve => setTimeout(resolve, 2000));
  },
  receive_assignment: async (address: string) => {
    return new Promise(resolve => setTimeout(resolve, 3000));
  }
};
