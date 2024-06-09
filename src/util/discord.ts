class DiscordUser {
    constructor( 
      public username: string, 
      public id: string ,
      public discriminator: string,
    ) {}
  }
  
  export let user = new DiscordUser("alex5402", '803060151082418217', "hi");