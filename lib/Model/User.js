/**
 * Created by wang on 2014/8/1.
 */

/*Class of user.*/
function User() {
    this.id = '';
    this.tenant = 0;
    this.username = '';
    this.firstname = '';
    this.lastname = '';
    this.sex = 0;
    this.bithdate = new Date('0001');
    this.workFromDate = new Date('0001');
    this.terminatedDate = new Date('0001');
    this.contacts = '';
    this.status = 1;
    this.activation_status = 0;
    this.email = '';
    this.phone = '';
    this.phone_activation = 0;
    this.removed = 0;
}

module.exports=User;