class userDTO {
    constructor(userData={}){
        this.id = userData._id?.toString() || "anonimo";
        this.email = userData.email || null
        this.name = userData.name || "anonimo";
        this.lastname = userData.lastname || "";
        this.cart = userData.cart || null;
        this.address = userData.address || "";
        this.phone = userData.phone || "";
        this.age = userData.age || "";
    }
}

export default userDTO;