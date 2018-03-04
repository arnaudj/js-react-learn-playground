import React from 'react';

// https://reactjs.org/docs/thinking-in-react.html
export default class ThinkingInReact extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.PRODUCTS = [
            { category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football' },
            { category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball' },
            { category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball' },
            { category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch' },
            { category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5' },
            { category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7' }
        ];
    }

    render() {
        return (<div>ThinkingInReact <FilterableProductTable products={this.PRODUCTS} /></div>);
    }
}

class ProductCategoryRow extends React.Component {
    render() {
        const category = this.props.category;
        return (
            <tr>
                <th colSpan="2">
                    {category}
                </th>
            </tr>
        );
    }
}

class ProductRow extends React.Component {
    render() {
        const product = this.props.product;
        const name = product.stocked ?
            product.name :
            <span style={{ color: 'red' }}>
                {product.name}
            </span>;

        return (
            <tr>
                <td>{name}</td>
                <td>{product.price}</td>
            </tr>
        );
    }
}

class ProductTable extends React.Component {
    render() {
        const filterText = this.props.filterText;
        const inStockOnly = this.props.inStockOnly;
        const rows = [];
        let lastCategory = null;

        this.props.products.forEach((product) => {
            if (product.name.indexOf(filterText) === -1) {
                return;
            }
            if (inStockOnly && !product.stocked) {
                return;
            }

            if (product.category !== lastCategory) {
                rows.push(
                    <ProductCategoryRow
                        category={product.category}
                        key={product.category} />
                );
            }
            rows.push(
                <ProductRow
                    product={product}
                    key={product.name} />
            );
            lastCategory = product.category;
        });

        return (
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

class SearchBar extends React.Component {
    render() {
        return (
            <form>
                <input type="text" placeholder="Search..." value={this.props.filterText}
                    onChange={(e) => this.props.onFilterTextChange(e.target.value)} />
                <p>
                    <input type="checkbox" checked={this.props.inStockOnly}
                        onChange={(e) => this.props.handleInStockChange(e.target.checked)} />
                    {' '}
                    Only show products in stock
                </p>
            </form>
        );
    }
}

class FilterableProductTable extends React.Component {
    constructor() {
        super();
        this.state = { filterText: '', inStockOnly: false }
    }

    onInStockChange(inStockOnly) {
        this.setState({
            inStockOnly: inStockOnly
        });
    }
    onFilterTextChange(filterText) {
        this.setState({
            filterText: filterText
        });
    }

    render() {
        return (
            <div>
                <SearchBar filterText={this.state.filterText} inStockOnly={this.state.inStockOnly}
                    handleInStockChange={(value) => this.onInStockChange(value)}
                    onFilterTextChange={(value) => this.onFilterTextChange(value)} />
                <ProductTable products={this.props.products} filterText={this.state.filterText} inStockOnly={this.state.inStockOnly} />
            </div>
        );
    }
}