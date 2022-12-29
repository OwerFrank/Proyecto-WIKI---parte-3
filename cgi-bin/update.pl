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

if(validarUpdate($title,$owner)){
  #Establece la conexión a la base de datos
  my $user = 'alumno';
  my $password = 'pweb1';
  my $dsn = "DBI:MariaDB:database=pweb1;host=192.168.1.23";

  my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");
  
  my $sql = "UPDATE Articles SET text=? WHERE title=? AND owner=?";
  my $sth = $dbh->prepare($sql);
  $sth->execute($text,$title,$owner);
  print "<article>\n";
  print "<title>$title</title>\n";
  print "<text>\n";
  print "$text";
  print "\n</text>\n";
  print "</article>\n";
  $sth->finish;
  $dbh->disconnect;
}else{
  print "<article>\n</article>\n";
}

sub validarUpdate {
  my $title = $_[0];
  my $owner = $_[1];

  my $user = 'alumno';
  my $password = 'pweb1';
  my $dsn = "DBI:MariaDB:database=pweb1;host=192.168.1.23";

  my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");

  my $sth1 = $dbh->prepare("SELECT * FROM Articles WHERE title='$title' AND owner='$owner'");
  $sth1->execute();
  my @row = $sth1->fetchrow_array;
  $sth1->finish;
  $dbh->disconnect;

  return @row;

}
