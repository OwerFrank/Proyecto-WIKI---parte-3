#!/usr/bin/perl -w
use strict;
use warnings;
use CGI;
use DBI;

#Recibe los párametros del formulario
my $q = CGI->new;
my $title = $q->param('title');
my $text = $q->param('text');
my $owner = $q->param('owner');

#Imprime el XML
print $q->header('text/xml');
print "<?xml version='1.0' encoding='utf-8' ?>\n";

if(validarNew($title,$owner)){
  print "<article>\n</article>\n";
}else{
  #Establece la conexión a la base de datos
  my $user = 'alumno';
  my $password = 'pweb1';
  my $dsn = "DBI:MariaDB:database=pweb1;host=192.168.1.23";

  my $dbh = DBI->connect($dsn,$user,$password) or die("No se pudo conctar!");

  my $sth = $dbh->prepare("INSERT INTO Articles(title,text,owner) VALUES(?,?,?)");
  $sth->execute($title,$text,$owner);

  print "<article>\n";
  print "<title>$title</title>\n";
  print "<text>$text</text>\n";
  print "</article>\n";

  $sth->finish;
  $dbh->disconnect;
}

sub validarNew {
  my $title = $_[0];
  my $owner = $_[1];
  my $user = 'alumno';
  my $password = 'pweb1';
  my $dsn = "DBI:MariaDB:database=pweb1;host=192.168.1.23";

  my $dbh = DBI->connect($dsn,$user,$password) or die("No se pudo conctar!");

  my $sth = $dbh->prepare("SELECT * FROM Articles WHERE title=? AND owner=?");
  $sth->execute($title,$owner);
  my @row = $sth->fetchrow_array;
  
  $sth->finish;
  $dbh->disconnect;

  return @row;
}
