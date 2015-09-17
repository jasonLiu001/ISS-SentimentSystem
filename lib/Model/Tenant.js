/**
 * Created by wang on 2014/8/1.
 */

/*Class of tenant.*/
function Tenant() {
    this.name = '';
    this.alias = '';
    this.mappedDomain = '';
    this.customerNames = '';
    this.version = 0;
    this.language = 'cn-zh';
    this.trustedDomains = 'com';
    this.trustedDomainsEnabled = 0;
}

module.exports=Tenant;

