export const createNewUserUtil = (props: {
  username: string;
  password: string;
  shouldHash: boolean;
}) => {
  return {
    username: props.username,
    password: props.password,
    shouldHash: props.shouldHash,
    daily_allowance: 20,
    energy: 20,
    isVirgin: false,
  };
};
