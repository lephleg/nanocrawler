import React, { Fragment } from "react";
import { FormattedNumber } from "react-intl";
import injectClient from "../../lib/ClientComponent";

class PriceWithConversions extends React.PureComponent {
  static defaultProps = {
    nano: true,
    precision: {
      nano: 6,
      btc: 6,
      usd: 2
    }
  };

  getValueForCurrency(cur) {
    const { amount, ticker } = this.props;
    if (!ticker) return 0;

    switch (cur) {
      case "nano":
        return amount;
      case "usd":
        return amount * parseFloat(ticker.price_usd, 10);
      case "btc":
        return amount * parseFloat(ticker.price_btc, 10);
      default:
        return new Error(`${cur} is not currently supported`);
    }
  }

  getDisplayValueForCurrency(cur) {
    const value = this.getValueForCurrency(cur);

    switch (cur) {
      case "nano":
        return (
          <Fragment>
            <FormattedNumber
              value={value}
              maximumFractionDigits={this.props.precision.nano}
            />{" "}
            NANO
          </Fragment>
        );
      case "usd":
        return (
          <FormattedNumber value={value} style="currency" currency="USD" />
        );
      case "btc":
        return (
          <Fragment>
            ₿<FormattedNumber
              value={value}
              maximumFractionDigits={this.props.precision.btc}
            />
          </Fragment>
        );
      default:
        return null;
    }
  }

  getConvertedValues() {
    const { currencies, ticker } = this.props;
    if (!ticker) return null;

    let conversions = currencies.map(cur =>
      this.getDisplayValueForCurrency(cur)
    );
    return conversions.join(" / ");
  }

  render() {
    const { currencies } = this.props;

    if (this.props.children) {
      return this.props.children(
        ...currencies.map(cur => this.getDisplayValueForCurrency(cur))
      );
    } else {
      return this.getConvertedValues();
    }
  }
}

export default injectClient(PriceWithConversions);
