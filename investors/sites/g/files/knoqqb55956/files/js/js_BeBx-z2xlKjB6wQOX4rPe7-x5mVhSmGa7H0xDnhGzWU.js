// Default Theme JS that will be loaded on all pages.
// Note that this is the format JS should be wrapped in.
//
// See: https://www.drupal.org/node/2269515

(function ($, Drupal) {


  Drupal.behaviors.domainRedirect = {
    attach: function (context, settings) {
      if(window.location.hostname == 'ir.viacom.com') {
        var urlCurrent = window.location.href;
        urlCurrent = urlCurrent.toString();
        urlFinal = urlCurrent.replace(/ir\.viacom\.com/,"ir.viacbs.com")
        window.location = urlFinal;
      }
    }
  };


  /* Adds target="_blank" to PDFs and other documents */
  Drupal.behaviors.blanktargets = {
    attach: function (context, settings) {
      $('#ndq-content .field__item a[href*="static-files"],' +
        '#ndq-content .file-link a, #ndq-content .html-link a,' +
        'a[href$=".pdf"],.nir-node--13096 #ndq-content article a,' +
        '.nir-node--type-nir-sec-filing .field--name-field-nir-sec-form a,' +
        '.nir-widget--event--add-to-calendar a,' +
        '#ndq-content .primary-download .download-item a[href*="static-files"]').each(function(){
        $(this).attr('target','_blank');
      });
    }
  };



  /* Show/hide archived items */
  Drupal.behaviors.archiveditems = {
    attach: function (context, settings) {
      $('#ndq-content .block--nir-assets__widget .archived-items > .primary-button').click(function(e) {
        e.preventDefault();
        var buttonLabel = $('.label', this);
        $(this).next('.nir-widget--content').slideToggle(function() {
          buttonLabel.text('Hide archived items');
          if ($(this).is(':visible')) {
            buttonLabel.text('Hide archived items');               
          } else {
            buttonLabel.text('Show archived items');               
          }            
        })
      });
    }
  };

  /* Country selector - destroy chosen */
  Drupal.behaviors.countrySelector = {
    attach: function (context, settings) {
      $('.primary-footer .wrapper .country-selector select').chosen('destroy');
    }
  };

  /* Country selector - destroy chosen */
  Drupal.behaviors.newsTable = {
    attach: function (context, settings) {
      $('.nir-node--type-nir-news #ndq-content .node--nir-news--full table').wrap('<div class="table-wrapper"></div>');
    }
  };

  /* Quote toggle chosenified */
  Drupal.behaviors.quoteToggle = {
    attach: function (context, settings) {
      if ($('body').hasClass('nir-node--5916')) {
        var waitStockAjax = setInterval(function(){
          if ($('body').hasClass('nmdbsq')) {
            clearInterval(waitStockAjax);
            $('#ndq-content .quote-wrapper select').chosen({ "disable_search": true }).prop("selectedIndex", 0).trigger("change","chosen:updated");
          }
        }, 1000)
      }
    }
  };

  /* Manipulate generated link from bundled content */
  Drupal.behaviors.homeBundleLink = {
    attach: function (context, settings) {
      $('.webcast-and-materials .secondary-download a').once('homeBundleLink').each(function() {
        $(this).addClass('download theme-color').wrapInner('<span class="copy copy-02"><strong></strong></span>');
        $(this).next('.filesize').appendTo($(this));
      });
      $('.webcast-and-materials .secondary-download').once('homeBundleLink').show();
    }
  };


  /* CHESEN all - remove search */
  $("#ndq-content form select").chosen({
    disable_search: true
  });

  /* CHOSEN News */
  Drupal.behaviors.chosenNews = {
    attach: function (context, settings) {
      var link = window.location.search;
      var $select = $('#edit-bc9f0a11-field-nir-news-category-value', context);
      var allOption = {value: 'all',text : 'All Releases'};

      $select.each(function(){

        if (link != undefined) {
          if (link.indexOf("field_nir_news_category") == -1) {
            allOption.selected = 'selected';
          }
        }

        $(this).chosen('destroy');
        $(this).removeAttr('multiple');

        if(!$(this).val()) {
          allOption.selected = 'selected'
        };
        $(this).prepend($('<option/>', allOption));

        $(this).chosen({
          placeholder_text_single: 'All Releases',
          disable_search: true
        });

        $(this).closest('form').submit(function(e) {
          if($(this).find('#edit-bc9f0a11-field-nir-news-category-value').val() == 'all') {
            $(this).find('#edit-bc9f0a11-field-nir-news-category-value').remove();
          }
        });
      });
    }
  };

  /* CHOSEN SEC */
  Drupal.behaviors.chosenSEC = {
    attach: function (context, settings) {

      var $select = $('#edit-field-nir-sec-form-group-target-id', context);
      var allOption = {value: 'all',text : 'All Filings'};

      $select.each(function(){
        $(this).chosen('destroy');
        $(this).removeAttr('multiple');

        if(!$(this).val()) {
          allOption.selected = 'selected'
        };
        $(this).prepend($('<option/>', allOption));

        $(this).chosen({
          placeholder_text_single: 'All Filings',
          disable_search: true
        });

        $(this).closest('form').submit(function(e) {
          if($(this).find('#edit-field-nir-sec-form-group-target-id').val() == 'all') {
            $(this).find('#edit-field-nir-sec-form-group-target-id').remove();
          }
        });

        $(this).on('change',function(){
          if($(this).val() == 'all'){
            $(this).remove();
            $(this).closest("form").submit();
          }
        });
      });

    }
  };


  Drupal.behaviors.secEntities = {
    attach: function (context, settings) {
      var link = window.location.pathname;
      $("#sec-company-name, #news-archive-status, #presentations-archive-status").each(function() {
        $("option[value='" + link +"']", this).attr("selected", true).trigger("chosen:updated");;
      });
      $("#sec-company-name, #news-archive-status, #presentations-archive-status").on('change',function(){
        window.location.href = $(this).val();
      });
    }
  };

  /* Dynamic Stock Chart mobile fix */
  Drupal.behaviors.mobileChartFix = {
    attach: function (context, settings) {
      var supportsOrientationChange = "onorientationchange" in window,
        orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
      window.addEventListener(orientationEvent, function() {
        $('iframe.nir-stock-chart').attr('src', $('iframe.nir-stock-chart').attr('src'));
      }, false);
    }
  };

  /* Search filter parameters fix	*/
  Drupal.behaviors.siteSearchFix = {
    attach: function (context, settings) {
      function getQuery(name){
        if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
          return decodeURIComponent(name[1]);
      }
      var searchType = getQuery('f[0]');
      if(searchType) {
        $('body.search .view-search button[type="submit"]', context).click(function(e) {
          e.preventDefault();
          var searchText = $('body.search .view-search input[name="query"]').val();
          if (searchText) {
            var searchQuery = '/search?query=' + encodeURIComponent(searchText) + '&f%5B0%5D='  + encodeURIComponent(searchType) + '&op=Search';
            window.location = searchQuery;
          } else {
            alert("Please fill out the search field.");
          }
        });
      }
    }
  };

  Drupal.behaviors.alertsautofill = {
    attach: function (context, settings) {
      $(document).ready(function(){
        $("body.nir-node--5936").each(function(){
          var getUrlParameter = function getUrlParameter(sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
              sParameterName = sURLVariables[i].split('=');

              if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
              }
            }
          };

          var getEmailValue = getUrlParameter('nir_email_alerts_signup_email');

          if(typeof getEmailValue != 'undefined'){
            $("input#edit-nir-email-alerts-signup-email").val(getEmailValue)
          }else{
            console.log("no var")
          };
        });

      });

    }
  };

  /* Function to set active parent elements for detail pages */
  Drupal.behaviors.iractivenav = {
      attach: function (context, settings) {

          var link = window.location.pathname;
          var active_class = 'is-active';
          var menu_selector = '.investors-menu ul.list';		// This is the block that the nav is within

          $(menu_selector + ' li', context).each(function (){
              var aURL = $(this).find('a').attr('href');

              if (link != undefined && link != '/') {

                  if (link.indexOf("/event-details/") != -1) {
                      if (aURL.indexOf("/events-webcasts-annual-meetings") != -1) {
                          $(this).addClass(active_class);
                      }
                  }
                  if (link.indexOf("/news-release-details/") != -1) {
                      if (aURL.indexOf("/press-releases") != -1) {
                          $(this).addClass(active_class);
                      }
                  }
                  if (link.indexOf("/sec-filings/") != -1) {
                      if (aURL.indexOf("/sec-filings") != -1) {
                          $(this).addClass(active_class);
                      }
                  }

              }
          });

      }
  };

  Drupal.behaviors.footerNavFix = {
      attach: function (context, settings) {
        $(".footer-navigation ul.links li.link" ).on("hover", function(){
          var $this = $(this);
          $this.toggleClass("open");
        });

        if($(window).width() < 750) {
          $(".footer-navigation ul.links li.link:nth-of-type(1)" ).addClass('open');
        }

        $(".footer-navigation ul.links li.link" ).on("touchstart", function(){
          $(".footer-navigation ul.links li.link" ).removeClass('open');
          var $this = $(this);
          $this.addClass("open");
        });
      }
  };

})(jQuery, Drupal);





/* jQ */
jQuery(function () {

  setTimeout(function () {
    jQuery('#ndq-content .news-release .buttons .newWin, .view-widget-bundled-content .list .item .download, .ndq-44471 .primary-download .download-item .download-block').each(function () {
      jQuery(this).attr("target","_blank");;
    });
  }, 1000);

});
;

(function ($, Drupal) {
    $(function() {
        $('button.navbar-toggler').on('click', () => {
            $('button.navbar-toggler').toggleClass('show-button')
        })

        $('.hover-span').each(function() {
            const background = $(this).attr('data-bg')
            $(this).css('background-color', background)
            if (background === 'rgba(127, 234, 237, 1)') {
                $(this).parent().addClass('change-bg')
            }
        })
    });
    ;
    $(document).ready(function () {

      $('footer .dropdown').click(function () {
        if (window.outerWidth < 1007) {
          if ($(this).hasClass('show-list')) {
            closeMenu(this)
          } else {
            openMenu(this)
          }
        }
      })
      function closeMenu(el) {
        $(el).closest('.dropdown').toggleClass('show-list')
        $(el).children('.footer-box').find('.down-arrow').show()
        $(el).children('.footer-box').find('.up-arrow').hide()
        $(el).children('.footer-box').find('h4').removeAttr('style')
        $(el).children('.footer-box').children('p').css('display', 'none')
      }
      function openMenu(el) {
        const color = $(el).children('.footer-box').find('h4').attr('data-active-color')
        $(el).toggleClass('show-list')
        $(el).children('.footer-box').find('.down-arrow').hide()
        $(el).children('.footer-box').find('.up-arrow').show()
        $(el).children('.footer-box').find('h4').css('color', color)
        $(el).children('.footer-box').children('p').css('display', 'inline-table')
      }

      if (window.matchMedia('(min-width: 992px)').matches) {
        $('footer .footer-top .footer-box h4').each(function () {
          const color = $(this).attr('data-active-color')
          if (color == 'rgba(127, 234, 237, 1)') {
            $(this).css('color', '#000a3c')
            $(this).parent('').parent('').next('p').css('color', '#000a3c')
          }
        })
      }
     $('footer .footer-top .footer-box').parent().hover(function() {
        $(this).find('.footer-box').addClass('hovered');
        $(this).siblings().find('.footer-box').addClass('sibling-hovred');
    }, function() {
         $(this).find('.footer-box').removeClass('hovered');
        $(this).siblings().find('.footer-box').removeClass('sibling-hovred');
    });
    });
    ;
    $(".coh-accordion-tabs-nav").addClass("list-unstyled d-flex");
    $(document).ready(function() {
        function Tab() {
            this.init = function() {
                const gradient = '<div class="tab-gradient-wrapper"></div>'
                $('.test-accrodion-class .coh-accordion-tabs-nav').after(gradient)
            };
            $('.resource-list-wrapper .more-button').click(function() {
                $('.resource-list-wrapper .coh-row:nth-child(1n+3)').addClass(
                    'show'
                )
                $('.resource-list-wrapper .coh-row:nth-child(2) .tab-item:nth-child(3)').addClass(
                    'show'
                )
                $(this).hide()
            })
            if ($('.resource-list .tab-item').length < 6) {
                $('.resource-list-wrapper .more-button').hide();
            }
        }
        if ($(".resource-list-wrapper").length) {
            new Tab().init();
        }
    });
    $(function() {
        function PriorityNavWrapper() {
            function priorityNav() {
                let navElementsWidth = 0
                let navElementsHiddenWidth = 0
                let navElementsShownWidth = 0
                const moreButtonWidth = $('#priority-nav .dropdown-wrapper').outerWidth(true)
                const navWidth =
                    $('#priority-nav .priority-nav-container').outerWidth(true) - 245 // -245 for making room for the dropdown menu
                const navElementsTemp = []
                $('#priority-nav .nav>li').each(function() {
                    navElementsWidth += +$(this).outerWidth(true)
                    $(this).attr('data-width', $(this).outerWidth(true))
                    if (navElementsWidth + moreButtonWidth >= navWidth) {
                        navElementsTemp.push(this)
                    } else {
                        navElementsShownWidth += +$(this).outerWidth(true)
                    }
                })

                $(navElementsTemp).prependTo($('#priority-nav .dropdown ul'))
                $('#priority-nav .dropdown ul>li').each(function() {
                    navElementsHiddenWidth += +$(this).attr('data-width')
                    if (
                        navElementsShownWidth + navElementsHiddenWidth + moreButtonWidth <=
                        navWidth
                    ) {
                        $('#priority-nav .nav').append($(this))
                    } else {
                        return false
                    }
                })
                if ($('#priority-nav .dropdown ul>li').length > 0) {
                    $('#priority-nav .dropdown-wrapper').css('display', 'block')
                } else {
                    $('#priority-nav .dropdown-wrapper').css('display', 'none')
                }
            }

            $(window).on('resize load', function(e) {
                if (window.matchMedia('(min-width: 992px)').matches) {
                    priorityNav(e.type)
                }
            })

            // Making Nav Sticky
            const stickyNavTop = $('#priority-nav').parent().offset().top
            const stickyNav = () => {
                const scrollTop = $(window).scrollTop()



                if (scrollTop > stickyNavTop) {
                    $('#priority-nav').parent('.nav-wrapper').addClass('sticky')

                } else {
                    $('#priority-nav').parent('.nav-wrapper').removeClass('sticky')

                }
            }

            stickyNav() // run for initial load
            $(window).scroll(stickyNav)

            // Active class toggle logic
            $('.priority-nav-container a').click(function() {
                $(this).addClass('active')
                $(this)
                    .closest('.priority-nav-container')
                    .find('a')
                    .not($(this))
                    .removeClass('active')
            })
            const addGradient = function() {
                const background = $('#priority-nav').attr('data-bg')
                const secondBackgroundColor = background.replace('1)', '0)')

                const backgroundImage = 'linear-gradient(270deg , ' + background + ' 0% , ' + secondBackgroundColor + ' 100% )';


                $('#priority-nav').parent('.nav-wrapper').find('.gradient').css('background-image', backgroundImage)
            }
            this.init = function() {
                addGradient()
            }
        }

        if ($('.nav-wrapper').length) {
            new PriorityNavWrapper().init()
        }
    });

})(jQuery, Drupal);
;
(function ($, Drupal) {
  'use strict';
  Drupal.behaviors.nirWebsiteNotices = {
    attach: function (context, settings) {

      $('.notification-modal').each(function (index) {
        var cookieLength = $(this).data('cookie-length');
        if (cookieLength === 0) {
          cookieLength = '';
        }
        var cookieId = $(this).data('id');
        var notificationType = $(this).data('notification-type');

        if (!Cookies.get('nir_notice_' + cookieId)) {
          var buttonText = 'Accept';
          if (notificationType === 'notification') {
            buttonText = 'OK';
          }
          $(this).dialog({
            modal: true,
            width: 500,
            closeOnEscape: false,
            close: function () {
              $(this).dialog('close');
              Cookies.set(
                'nir_notice_' + cookieId,
                'true',
                {expires: cookieLength});
            },
            buttons: [
              {
                text: buttonText,
                dialogClass: notificationType,
                click: function () {
                  $(this).dialog('close');
                  Cookies.set(
                    'nir_notice_' + cookieId,
                    'true',
                    {expires: cookieLength});
                }
              }
            ]
          });
          if (notificationType === 'disclaimer'){
            $('.ui-dialog-titlebar-close').hide();
          }
        }

      });
    }
  };
})(jQuery, Drupal);
;
(function ($, Drupal, DrupalSettings) {
  'use strict';
  Drupal.behaviors.nirMarketDataBlock = {
    attach: function (context, settings) {
      var ajax_flag = 'TRUE';
      if (!$(document.body).hasClass('nmdbsq')) {
        $('.block-market-data-block__stock-quote', context).once('stockQuoteBlock').each(
          function (i, obj) {
            // An ID could not exist and we'd have to set one manually.
            var id = $(this).attr('id');
            if (!id && $(this).data('uuid')) {
              id = 'nir-ipe-block_' + $(this).data('uuid')
              $(this).attr('id', id);
            }
            if (id) {
              var panel_id = $(this).attr('data-storage-id');
              if (panel_id) {
                ajax_flag = 'TRUE';
                var editTab = null;
                if (Drupal.panels_ipe && Drupal.panels_ipe.app) {
                  editTab = Drupal.panels_ipe.app.get('editTab');
                  if (editTab.get('active') && !editTab.get('loading')) {
                    ajax_flag = 'FALSE';
                  }
                }
              }
              else {
                panel_id = 'NULL';
              }
              var url = 'ajax/market-data-api/stock-quote/' + id + '/' + panel_id + '/' + ajax_flag;
              var stockLoaderAjax = Drupal.ajax({
                url: Drupal.url(url),
                type: 'GET'
              });
          
              if (!editTab || (!editTab.get('active') && !editTab.get('loading'))) {
                stockLoaderAjax.execute();
              }
            }
          }
        );
        $(document.body).addClass('nmdbsq');
      }
    }
  };
})(jQuery, Drupal, drupalSettings);
;
(function ($, Drupal) {
  'use strict';
  Drupal.behaviors.stockQuote = {
    attach: function (context, settings) {
      $('.quote-wrap').each(function () {
        if ($('.user-toggle-on').length) {
          $(document).on('change', '.quote-wrap select', function () {
            var val = $(this).val();
            var wrap = $(this).parent();
            $('.stock-quote', wrap).css('display', 'none');
            $('.stock-quote[data-exchange="' + val + '"]', wrap).css('display', 'block');
          });
        }
      });
    }
  };
})(jQuery, Drupal);

;
