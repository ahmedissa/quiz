

class Player {

  constructor(socket, uid, email, name, profileImage){
    this.name = name;
    this.uid = uid; 
    this.email = email;
    this.name = name;
    this.profileImage = profileImage;
    this.disconnected = false;
    this.socket.on('disconnect', this.handleDisconnect.bind(this))
  }


  handleDisconnect() {
    this.disconnected = true;
  }

}

module.exports = Player;