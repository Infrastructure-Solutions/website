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

function Public_keys(title, key) {
    this.init(title, key);
}

Public_keys.prototype.init = function(title, key) {
    this.title = title;
    this.key = key;
};

function User(provider, vcs, public_keys) {
    this.init(provider, vcs, public_keys);
}

User.prototype.init = function(provider_name, provider_user_name, vcs_url, vcs_user_name, public_keys, keys) {
    this.provider = new Provider(provider_name, provider_user_name);
    this.vcs = new Vcs(vcs_url, vcs_user_name);
    this.public_keys = keys;
};

function Distribution(os, version){
    this.init(os, version);
}

Distribution.prototype.init(os, version){
    this.os = os;
    this.version = version;
}

function Applications(name){
    this.init(name);
}

Applications.prototype.init(name){
    this.name = name;
}

unction Packages(name, version, config){
    this.init(name, version, config);
}

Packages.prototype.init(name, version, config){
    this.name = name;
    this.version = version;
    this.config = config;
}

function Server(domain, hostname, provisioner, ditribution_os, distribution_version, applications_name, packages_name, packages_version, packages_config) {
    this.init(domain, hostname, provisioner, ditribution_os, distribution_version, applications_name, packages_name, packages_version, packages_config);
}

Server.prototype.init = function(domain, hostname, provisioner, ditribution_os, distribution_version, applications, packages_name, packages_version, packages_config) {
    this.domain = domain;
    this.hostname = hostname;
    this.provisioner = provisioner;
    this.distribution = new Distribution(ditribution_os, distribution_version);
    this.applications = applications;
};