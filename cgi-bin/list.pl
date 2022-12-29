#!/usr/bin/perl -w
use strict;
use warnings;
use CGI;
use DBI;

#Recibe los párametros del formulario
my $q = CGI->new;
my $owner = $q->param('owner');

#Imprime el XML
print $q->header('text/xml');
print "<?xml version='1.0' encoding='utf-8'?>\n";

if(validarUsers($owner)){ 
  my $user = 'alumno';
  my $password = 'pweb1';
  my $dsn = "DBI:MariaDB:database=pweb1;host=192.168.1.23";

  my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");
  
  #Consulta SQL de los títulos de la Base de Datos
  my $sth = $dbh->prepare("SELECT title FROM Articles WHERE owner=?");
  $sth->execute($owner);
  print "<articles>\n";
  
  while(my @row = $sth->fetchrow_array){
    print "<article>\n";
    print "<owner>$owner</owner>\n";
    print "<title>@row</title>\n";
    print "</article>\n";
  }

  print "</articles>\n";
  
  $sth->finish;
  $dbh->disconnect;

}else{
  print "<articles>\n</articles>\n";
}



sub validarUsers{
  my $owner = $_[0];
  
  my $user = 'alumno';
  my $password = 'pweb1';
  my $dsn = "DBI:MariaDB:database=pweb1;host=192.168.1.23";

  my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");
          
  my $sth = $dbh->prepare("SELECT * FROM Articles WHERE owner=?");
  $sth->execute($owner);
  my @row = $sth->fetchrow_array;
  $sth->finish;
  $dbh->disconnect;
  return @row;
}
