export type SignInData = {
  email: string;
  password: string;
};

export type SignUpData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

export type userInfo = {
  lastName: string;
  firstName: string;
  email: string;
};

export type Token = {
  accessToken: string;
  isAdmin: boolean
};
