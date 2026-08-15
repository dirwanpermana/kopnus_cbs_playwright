export interface Root {
  userCabang: UserCabang
  userPusat: UserPusat[]
}

export interface UserCabang {
  username: string
  password: string
  message: string
}

export interface UserPusat {
  username: string
  password: string
  message: string
}
