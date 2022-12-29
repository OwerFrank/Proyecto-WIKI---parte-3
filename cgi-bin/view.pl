#!/usr/bin/perl -w
use strict;
use warnings;
use diagnostics;
use CGI;
use DBI;

my $q = CGI->new;
my $title = $q->param('title');
my $owner = $q->param('owner');

print $q->header('text/xml');
print "<?xml version='1.0' encoding='utf-8'?>\n";

my $user = 'alumno';
my $password = 'pweb1';
my $dsn = "DBI:MariaDB:database=pweb1;host=192.168.1.23";
my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");

my $sth = $dbh->prepare("SELECT text FROM Articles WHERE title=? AND owner=?");
$sth->execute($title,$owner);

my @row = $sth->fetchrow_array;

$sth->finish;
$dbh->disconnect;

if(@row){
  print "<root>\n";
  renderBody(@row);
  print "</root>\n";
}else{
  print "<root>\n";
  print "</root>\n";
}

sub renderBody{

  #Guardamos primero el contenido del texto markdow 
  #Siendo esta la primera coincidencia de @row
  my $textBase = $_[0];
  my @lineasBase = split "\n", $textBase;


  for(my $i=0; $i<@lineasBase; $i++){

    #Bloque pre code
    if($lineasBase[$i] =~ /^```/){
      #Aumentamos 1 porque el contenido de este bloque no
      #inicia en la misma linea que la expresion regular
      $i++;
      print "<pre><code>\n";
      while($lineasBase[$i] !~ /^```/){
        print $lineasBase[$i]."\n";
        $i++;
      }
      print "</code></pre>\n";
    }
    else{
      print matchLine($lineasBase[$i])."\n";
    }
  }
}

#Algo descubierto nuevo a diferencia de otros lenguaje
#no es necesario poner un return por defecto en una función
sub matchLine{
  my $linea = $_[0];

  #El primer if para descartar las lineas en blanco
  if (!($linea =~ /^\s*$/ )){

    while ($linea =~ /(.*)(\_)(.*)(\_)(.*)/){
      $linea = "$1<em>$3</em>$5";
    }

    while ($linea =~ /(.*)(\[)(.*)(\])(\()(.*)(\))(.*)/) {
      $linea = "$1<a href='$6'>$3</a>$8";
    }

    while ($linea =~ /(.*)(\*\*\*)(.*)(\*\*\*)(.*)/) {
      $linea = "$1<strong><em>$3</em></strong>$5";
    }

    while ($linea =~ /(.*)(\*\*)(.*)(\*\*)(.*)/) {
      $linea = "$1<strong>$3</strong>$5";
    }

    while ($linea =~ /(.*)(\*)(.*)(\*)(.*)/) {
      $linea = "$1<em>$3</em>$5";
    }

    while ($linea =~ /(.*)(\~\~)(.*)(\~\~)(.*)/){
      $linea = "$1<del>$3</del>$5";
    }

    if ($linea =~ /^(\#)([^#\S].*)/) {
      return $linea = "<h1>\n$2\n</h1>";
    }
        elsif ($linea =~ /^(\#\#)([^#\S].*)/) {
      return $linea = "<h2>\n$2\n</h2>";
    }

    elsif ($linea =~ /^(\#\#\#)([^#\S].*)/) {
      return $linea = "<h3>\n$2\n</h3>";
    }

    elsif ($linea =~ /^(\#\#\#\#)([^#\S].*)/) {
      return $linea = "<h4>\n$2\n</h4>";
    }

    elsif ($linea =~ /^(\#\#\#\#\#)([^#\S].*)/) {
      return $linea = "<h5>\n$2\n</h5>";
    }

    elsif ($linea =~ /^(\#\#\#\#\#\#)([^\S].*)/) {
      return $linea = "<h6>\n$2\n</h6>";
    }

    else {
      return $linea = "<p>\n$linea\n</p>";
    }
  }
}

