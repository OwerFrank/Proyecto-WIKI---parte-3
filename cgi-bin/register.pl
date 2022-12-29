#!/usr/bin/perl -w
use strict;
use warnings;
use CGI;
use DBI;

#Recibe los párametros del formulario
my $q = CGI->new;
my $userName = $q->param('userName');
my $password = $q->param('password');
my $firstName = $q->param('firstName');
my $lastName = $q->param('lastName');

#Imprime el XML
print $q->header('text/XML');
print "<?xml version='1.0' encoding='utf-8'?>\n";

#Confirmar que este usuario no esté en el registro
if(validarRegistro($userName)==0){
  my $user = 'alumno';
  my $passwordDB = 'pweb1';
  my $dsn = "DBI:MariaDB:database=pweb1;host=192.168.1.23";

  my $dbh = DBI->connect($dsn, $user, $passwordDB) or die("No se pudo Conectar!");
  my $sth = $dbh->prepare("INSERT INTO Users(userName,password,lastName,firstName) VALUES(?,?,?,?)");
  $sth->execute($userName,$password,$lastName,$firstName);
  $dbh->disconnect;

  print "<user>\n";
  print "<owner>$userName</owner>\n";
  print "<firstName>$firstName</firstName>\n";
  print "<lastName>$lastName</lastName>\n";
  print "</user>\n"
}else{
  print "<user>\n</user>\n";
}

#Valida que no haya un usuario con el mismo nombre en la Base de Datos
sub validarRegistro{
  my $userName = $_[0];
  my $user = 'alumno';
  my $password = 'pweb1';
  my $dsn = "DBI:MariaDB:database=pweb1;host=192.168.1.23";

  my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo Conectar!");
  my $sth = $dbh->prepare("SELECT * FROM Users WHERE userName=?");
  $sth->execute($userName);
  my @row = $sth->fetchrow_array;
  $sth->finish;
  return @row;
}
