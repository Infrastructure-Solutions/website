function Provider(name, user_name) {
    this.init(name, user_name);
}

Provider.prototype.init = function(name, user_name) {
    this.name = name;
    this.user_name = user_name;
};

function Vcs(url, user_name) {
    this.init(url, user_name);
}

Vcs.prototype.init = function(url, user_name) {
    this.url = url;
    this.user_name = user_name;
};

function PublicKeys(title, key) {
    this.init(title, key);
}

PublicKeys.prototype.init = function(title, key) {
    this.title = title;
    this.key = key;
};

PublicKeys.prototype.addPublicKey = function(title, key){
    this.publicKeys.push(new PublicKeys(title, key));
};

PublicKeys.prototype.removePublicKey = function(publicKey){
    this.publicKeys = $.grep(this.publicKeys, function(elem, index) {
        return elem !== publicKey;
    });
};

function User(provider, vcs, publicKeys) {
    this.init(provider, vcs, publicKeys);
}

User.prototype.init = function(provider_name, provider_user_name, vcs_url, vcs_user_name) {
    this.provider = new Provider(provider_name, provider_user_name);
    this.vcs = new Vcs(vcs_url, vcs_user_name);
    this.publicKeys = [];
};

function Distribution(os, version){
    this.init(os, version);
}

Distribution.prototype.init = function(os, version){
    this.os = os;
    this.version = version;
};

function Applications(name, version, config){
    this.init(name, version, config);
}

Applications.prototype.init = function(name, version, config){
    this.name = name;
    this.version = version;
    this.config = config;
};

function Packages(name, version, config){
    this.init(name, version, config);
}

Packages.prototype.init = function(name, version, config){
    this.name = name;
    this.version = version;
    this.config = config;
};

function Server(domain, hostname, provisioner, ditribution_os, distribution_version, applications_name, packages_name, packages_version, packages_config) {
    this.init(domain, hostname, provisioner, ditribution_os, distribution_version, applications_name, packages_name, packages_version, packages_config);
}

Server.prototype.init = function(domain, hostname, provisioner, ditribution_os, distribution_version) {
    this.domain = domain;
    this.hostname = hostname;
    this.provisioner = provisioner;
    this.distribution = new Distribution(ditribution_os, distribution_version);
    this.applications = [];
    this.packages = [];
};

Server.prototype.addApplication = function(name, version, config){
    this.applications.push(new Application(name, version, config));
};

Server.prototype.removeAplication = function(aplication){
    this.packages = $.grep(this.packages, function(elem, index) {
        return elem !== aplication;
    });
};

Server.prototype.addPackage = function(name, version, config){
    this.packages.push(new Package(name, version, config));
};

Server.prototype.removePackage = function(application){
    this.applications = $.grep(this.applications, function(elem, index) {
        return elem !== application;
    });
};