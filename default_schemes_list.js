window.aDefaultSchemes = [];
window.aDefaultSchemes.push({ sName: "default_gojs_flowchart.yaml", sValue: `scheme:
  name: "new scheme 01"
  type: "yaml_gojs_flowchart"
  options:
    width: "700px"
    height: "1000px"
    layout:
  program:
    - "label1: action 01"
    - 
      - "condition 01" # name
      - "subaction 01" # yes
      - 
        - "subaction 03"
        - "#label1 link 01" # no
    - "action 02"
    - "action 03"
    -
      - "condition 02" # name
      - "subaction 02" # yes
      - "#label1 link 02" # no
    - "action 04"
    - "action 05"` });
window.aDefaultSchemes.push({ sName: "default_visjs_base.yaml", sValue: `scheme:
  name: "new scheme 01"
  type: "yaml_visjs_base"
  options:
    physics: false
    nodes:
      shape: "box"
    width: "1000px"
    height: "600px"
  styles: 
    style_01: &style_01
      background: "orange"
      border: "black"
  nodes:
    class_01:
      color: "red"
      label: "Class01"
  edges:
    relation_01:
      from: "class_01"
      to: "class_01"` });
window.aDefaultSchemes.push({ sName: "default_visjs_flowchart.yaml", sValue: `scheme:
  name: "new scheme 01"
  type: "yaml_visjs_flowchart"
  options:
    width: "500px"
    height: "1000px"
    physics: false
    layout:
      hierarchical:
        direction: "UD"
        sortMethod: "directed"
  program:
    - "label1: action 01"
    - 
      - "condition 01" # name
      - "subaction 01" # yes
      - 
        - "subaction 03"
        - "#label1 link 01" # no
    - "action 02"
    - "action 03"
    -
      - "condition 02" # name
      - "subaction 02" # yes
      - "#label1 link 02" # no
    - "action 04"
    - "action 05"` });
window.aDefaultSchemes.push({ sName: "default_visjs_pcs.yaml", sValue: `scheme:
  name: "new scheme 01"
  type: "yaml_visjs_pcs"
  options:
    width: "500px"
    height: "1000px"
    physics: false
    layout:
      hierarchical:
        direction: "UD"
        sortMethod: "directed"
  blocks:
    credit_application_01: &credit_application_01
      - "CreditApplication" #class
      - "initApplication" #method
      - "app/modules/credit_application/CreditApplication.class.php" #file
      - "222" #line
    sqlproc_01: &sqlproc_01
      - "SqlProc" #class
      - "get_app_form" #method
      - "app/modules/credit_application/SqlProc.class.php" #file
      - "222" #line
    sql__request_bank_accepted_price_01: &sql__request_bank_accepted_price_01
      - "sql_fields_select" # type
      - "request_bank"
      - "accepted_price"
      - "app/modules/credit_application/SqlProc.class.php"
      - "1577"
    tpl__requestToBank_list: &tpl__requestToBank_list
      - "tpl" # type
      - "list = item.notable__pp_request_bank_basic.content"
      - "tpls/inc/request_to_bank/requestToBank-list.twig"
      - "8"
    tpl__request_bank__accepted_price: &tpl__request_bank__accepted_price
      - "tpl" # type
      - "fnc.renderBox(
            item.request_bank__accepted_price, 
            {label:'стоимость', format: 'money', type: 'label'}
          )"
      - "tpls/inc/request_to_bank/requestToBank-list__item.twig"
      - "302"
      
  calls:
    - "GET"
    - "index.php?m=CreditApplication&a=initAppForm&reg=CreditApplication&mode=additional"
    -
      - *credit_application_01
      - *sqlproc_01
      - *sql__request_bank_accepted_price_01
      - *credit_application_01
      - *tpl__requestToBank_list
      - *tpl__request_bank__accepted_price` });
window.aDefaultSchemes.push({ sName: "default.yaml", sValue: `scheme:
    name: "test_01"
    options:
        # layout:
        #     hierarchical:
        #         direction: "LR"
        edges:
            smooth:
                type: "continuous"
        nodes:
            shape: "box"
        width: "1000px"
        height: "600px"
    styles: 
        box_01: &box_01
            background: "orange"
            border: "black"
        edge_01: &edge_01
            type: "arrow"
            lines_color: "#000000"
    nodes:
        class_01:
            color: "red"
            label: "Class01"
        class_02:
            color: 
                <<: *box_01
            label: "Class02"
        class_03:
            color: "red"
            label: "Class01"
        class_04:
            color: "red"
            label: "Class01"
        class_05:
            color: "red"
            label: "Class01"
        class_06:
            color: "red"
            label: "Class01"
        class_07:
            color: "red"
            label: "Class01"
        class_08:
            color: "red"
            label: "Class01"
    edges:
        relation_01:
            # style: 
            #   <<: *edge_01
            from: "class_01"
            to: "class_02"
        relation_02:
            from: "class_02"
            to: "class_03"
        relation_03:
            from: "class_03"
            to: "class_04"
        relation_04:
            from: "class_04"
            to: "class_05"
        relation_05:
            from: "class_05"
            to: "class_06"
        relation_06:
            from: "class_06"
            to: "class_07"` });
