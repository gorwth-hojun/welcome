
    callbackIsVisible('#ec-jigsaw-area-orderProduct .orderArea:not(.displaynone) .ec-base-prdInfo', function() {
        $('#ec-jigsaw-area-orderProduct .orderArea:not(.displaynone) .ec-base-prdInfo').each(function(index, item) {
            var productName = $(this).find('.description .prdName a').html()

            var splitedProductName = productName.split('</span>');
            if(splitedProductName.length > 1) {
                productName = splitedProductName[1];
                splitedProductName = productName.split('<span')
                if(splitedProductName.length > 0) {
                    productName = splitedProductName[0]
                }
            }

            var productId = '';
            var productCategory = '';

            var productPriceHtml = $(this).find('.priceValue').html();
            var productPrice = removeComma(productPriceHtml);

            var productQuantityHtml = $(this).find('.quantity').html();
            var productQuantity = removeComma(productQuantityHtml);

            var productIdHtml = $(this).find('.thumbnail a');
            var productUrl = $(productIdHtml).attr('href')
            if(productUrl != '') {
                productId = getProductCode(productUrl);
                productCategory = getCategoryCode(productUrl);
            }

            console.log(productId);
            console.log(productName)
            console.log(productPrice);
            console.log(productQuantity);
            console.log(productCategory);


            if(productName != '' && productPrice > 0 && productQuantity > 0 && productId != '') {
                productList.push({
                    'id': productId,
                    'name': productName,
                    'category' : productCategory,
                    'price': productPrice,
                    'quantity': productQuantity,
                    'list_name': productCategory
                })

            }
        })

        if(productList.length > 0) {
            var totalPrice = 0;
            for(var i in productList) {
                totalPrice += productList[i].price * productList[i].quantity;
                productIdList.push(productList[i].id);
            }

            if(totalPrice > 0) {
                if(typeof productList != 'undefined') {
                    if(productList.length > 0) {
                        dataLayer.push({
                            'event': 'checkout',
                            'ecommerce': {
                                'checkout': {
                                    'actionField': {'step': 1},
                                    'products': productList
                                }
                            }
                        });
                    }
                }

                var contents = [];
                for(var i in productList) {
                    contents.push({
                        'id' : productList[i].id,
                        'quantity': productList[i].quantity,
                        'item_price' : productList[i].price,
                        'category': productList[i].category,
                        'item_name': productList[i].name,
                    })
                }


            }
        }
    })






    function goNextStep() {
        var payMethod = '';
        $('input[name=addr_paymethod]').each(function(i,item){
            if($(this).is(':checked')){
                console.log($(this).val());
                if($(this).val() == 'card') {
                    payMethod = '카드'
                } else if($(this).val() == 'tcash') {
                    payMethod = '실시간 계좌이체'
                } else if($(this).val() == 'cell') {
                    payMethod = '휴대폰 결제'

                } else if($(this).val() == 'cash') {
                    payMethod = '무통장입금'
                } else if($(this).val() == 'icash') {
                    payMethod = '가상계좌'
                } else if($(this).val() == 'kakaopay') {
                    payMethod = '카카오페이'
                } else if($(this).val() == 'payco') {
                    payMethod = '페이코'
                }
            }
        });

        console.log(payMethod);
        if(payMethod != '') {
            dataLayer.push({
                'event': 'checkoutOption',
                'ecommerce': {
                    'currencyCode': 'KRW',                       // Local currency is optional.
                    'checkout_option': {
                        'actionField': {'step': 2, 'option': payMethod}
                    }
                },
                'pay_method': payMethod,
            });
        }
    }
