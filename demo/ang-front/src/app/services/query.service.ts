/**
 * Itse luotu service, jossa määritellään GraphQL-kutsut.
 * Funktiot palauttavat GraphQL-kutsun, mutta eivät suorita sitä.
 * Funktion kutsujan pitää suorittaa kutsu.
 */

import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  constructor(private apollo: Apollo) { }

  private GetClientsQuery = gql`
    query getClients {
      henkilot {
        _id
        nimi
        ika
        viestit {
          _id
          lahettaja
          lahettajanNimi
          sisalto
        }
      }
    }
  `;

  getClients() {
    return this.apollo.watchQuery<any>({
      query: this.GetClientsQuery,
      fetchPolicy: 'cache-and-network'
    });
  }

  addClient(nimi: string, ika: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation addClient($name: String!, $age: Int!) {
          lisaaHenkilo(nimi: $name, ika: $age) {
            nimi
            ika
          }
        }
      `, variables: {
        name: nimi,
        age: ika
      }, refetchQueries: this.GetClientsQuery
    });
  }

  sendMessage(lahettaja: string, vastaanottaja: string, sisalto: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation sendMessage($sender: String!, $recipient: String!, $msg: String) {
          lisaaViesti(lahettaja: $sender, vastaanottaja: $recipient, sisalto: $msg) {
            lahettaja
            sisalto
          }
        }
      `, variables: {
        sender: lahettaja,
        recipient: vastaanottaja,
        msg: sisalto
      }, refetchQueries: this.GetClientsQuery
    });
  }

}
