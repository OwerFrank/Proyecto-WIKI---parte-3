#!/usr/bin/perl -w
use strict;
use warnings;
use CGI;
use DBI;

#Obtener los parámetros de la solicitud HTTP
my $q = CGI->new;
my $userName = $q->param('userName');
my $password = $q->param('password');

#Imprime en XML
print $q->header('text/XML');
print "<?xml version='1.0' encoding='utf-8'?>\n";

if(verificarLogin($userName, $password)){
  #Establecer la conexión a la base de datos
  my $user = 'alumno';
  my $passwordDB = 'pweb1';
  my $dsn = "DBI:MariaDB:database=pweb1;host=192.168.1.23";
  my $dbh = DBI->connect($dsn,$user,$passwordDB) or die("No se pudo conectar!");
  
  #Preparar y ejecutar la consulta SQL
  #Consulta para solicitar el FirstName
  my $sth = $dbh->prepare("SELECT firstName FROM Users WHERE userName=? AND password=?");
  $sth->execute($userName,$password);
  my @row = $sth->fetchrow_array;
  
  #Consulta para solicitar el LastName
  $sth = $dbh->prepare("SELECT lastName FROM Users WHERE userName=? AND password=?");
  $sth->execute($userName,$password);
  my @row2 = $sth->fetchrow_array;

  $sth->finish;
  $dbh->disconnect;

  print "<user>\n";
  print "<owner>$userName</owner>\n";
  print "<firstName>$row[0]</firstName>\n";
  print "<lastName>$row2[0]</lastName>\n";
  print "</user>\n";
}else{
  print "<user>\n</user>\n";
}

sub verificarLogin{
  my $userName = $_[0];
  my $password = $_[1];
  
  my $user = 'alumno';
  my $passwordDB= 'pweb1';
  my $dsn = "DBI:MariaDB:database=pweb1;host=192.168.1.23";
  my $dbh = DBI->connect($dsn,$user,$passwordDB) or die("No se pudo conectar!");
  my $sth = $dbh->prepare("SELECT * FROM Users WHERE userName=? AND password=?");
  $sth->execute($userName,$password);
  my @row = $sth->fetchrow_array;

  $sth->finish;
  $dbh->disconnect;
  return @row;
}
