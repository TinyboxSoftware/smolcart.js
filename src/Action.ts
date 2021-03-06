/* eslint-disable no-prototype-builtins */
/* eslint-disable no-async-promise-executor */
import { ActionType, NewItem } from './types/index';

class Action {
  actionType: ActionType;
  data: Array<NewItem>;

  constructor(data: Array<NewItem>, actionType: ActionType) {
    this.actionType = actionType;
    this.data = data;
  }

  public execute(): Promise<Response | null> {
    switch (this.actionType) {
      case 'ADD':
        return this.executeAdd();
      case 'MODIFY':
        return this.executeModify();
      case 'GET_CART':
        return this.executeGetCart();
      case 'CLEAR_CART':
        return this.executeClearCart();
    }
  }

  private createAbsoluteURL(relPath: string): string {
    return `${window.location.protocol}//${window.location.host}${relPath}`;
  }

  public executeAdd(): Promise<Response | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(this.createAbsoluteURL('/cart/add.js'), {
          method: 'POST',
          body: JSON.stringify({
            items: this.data.map((item) => ({
              id: item.id,
              quantity: item.quantity || 1,
              properties: item.properties ? { ...item.properties } : undefined,
            })),
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return resolve(res);
      } catch (e) {
        return reject(e);
      }
    });
  }

  public executeModify(): Promise<Response | null> {
    return new Promise(async (resolve, reject) => {
      const itemToModify = this.data[0];
      try {
        const res = await fetch(this.createAbsoluteURL(`/cart/change.js`), {
          method: 'POST',
          body: JSON.stringify({
            id: itemToModify.id,
            quantity: itemToModify.hasOwnProperty('quantity')
              ? itemToModify.quantity
              : 0,
            properties: itemToModify?.properties
              ? { ...itemToModify?.properties }
              : undefined,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return resolve(res);
      } catch (e) {
        return reject(e);
      }
    });
  }

  public executeGetCart(): Promise<Response | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(this.createAbsoluteURL(`/cart.js`));
        const data = await res.json();
        return resolve(data);
      } catch (err) {
        return reject(err);
      }
    });
  }

  public executeClearCart(): Promise<Response | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(this.createAbsoluteURL(`/cart/clear.js`), {
          method: 'POST',
        });
        const data = await res.json();
        return resolve(data);
      } catch (err) {
        return reject(err);
      }
    });
  }
}

export default Action;
