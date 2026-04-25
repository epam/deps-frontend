
import {
  DictFieldData,
  ExtractedDataField,
  FieldData,
  TableData,
  Cell,
} from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'
import { Rect } from '@/models/Rect'
import { SourceBboxCoordinates } from '@/models/SourceCoordinates'

const mockExtractedData = [
  new ExtractedDataField(
    9999,
    new FieldData(
      true,
      new FieldCoordinates(
        1,
        0.1,
        0.2,
        0.3,
        0.4,
      ),
      1,
    ),
  ),
  new ExtractedDataField(
    888,
    [
      new FieldData(
        true,
        new FieldCoordinates(
          1,
          0.1,
          0.2,
          0.3,
          0.4,
        ),
        1,
        null,
        undefined,
        null,
        null,
        null,
        null,
        null,
        'List-Of-Checkboxes-subField-1-id',
      ),
      new FieldData(
        false,
        new FieldCoordinates(
          1,
          0.1,
          0.2,
          0.3,
          0.4,
        ),
        1,
      ),
    ],
    null,
    { 'List-Of-Checkboxes-subField-1-id': 'List Of Checkboxes subField-1 Alias' },
  ),
  new ExtractedDataField(
    666,
    new FieldData(
      'test',
      new FieldCoordinates(
        1,
        0.1,
        0.2,
        0.3,
        0.4,
      ),
      1,
    ),
  ),
  new ExtractedDataField(
    725,
    new FieldData(
      'INVOICE',
      new FieldCoordinates(
        1,
        0.475409836066,
        0.057275226555,
        0.147540983607,
        0.072124359366,
      ),
      1,
    ),
  ),
  new ExtractedDataField(
    726,
    new DictFieldData(
      new FieldData(
        'AA Associates',
        new FieldCoordinates(
          1,
          0.135245901639,
          0.112429148423,
          0.132786885246,
          0.033940874996,
        ),
        1,
      ),
      new FieldData(
        'MY 352684',
        new FieldCoordinates(
          2,
          0.140983606557,
          0.166522417948,
          0.117213114754,
          0.028637613278,
        ),
        1,
      ),
    ),
  ),
  new ExtractedDataField(
    727,
    new DictFieldData(
      new FieldData(
        'TOTAL DUE AMOUNT',
        new FieldCoordinates(
          2,
          0.526229508197,
          0.696848589757,
          0.159836065574,
          0.033940874996,
        ),
        1,
      ),
      new FieldData(),
    ),
  ),
  new ExtractedDataField(
    728,
    new DictFieldData(
      new FieldData(),
      new FieldData(
        'AA Associates',
        new FieldCoordinates(
          2,
          0.122950819672,
          0.116671757798,
          0.137704918033,
          0.025455656247,
        ),
        1,
      ),
    ),
  ),
  new ExtractedDataField(
    729,
    new TableData(
      1,
      [{ y: 0 }, { y: 0.5205479452 }],
      [
        { x: 0 },
        { x: 0.5005393743 },
        { x: 0.836030205 },
      ],
      [
        new Cell(0, 0, '', 2, 1, 1, 1),
        new Cell(0, 1, 'SUBTOTAL 52,100.00', 1, 2, 1, 1),
        new Cell(1, 1, 'SALES TAX — 5%', 1, 1, 1, 1),
        new Cell(1, 2, '$105.00', 1, 1, 1, 1),
      ],
      new Rect(0.1448, 0.5926501035196687, 0.7596, 0.07712215320910976),
      null,
      null,
      undefined,
      null,
      new SourceBboxCoordinates(null, 1, [new Rect(0.1448, 0.5926501035196687, 0.7596, 0.07712215320910976)]),
    ),
    0,
  ),
  new ExtractedDataField(
    730,
    [
      new FieldData('Confirm before collaction', new FieldCoordinates(
        1,
        0.524590163934,
        0.364864406204,
        0.15,
        0.041365441401,
      ), 1,
      ),
      new FieldData('aaa', new FieldCoordinates(
        2,
        0.815573770492,
        0.118793062485,
        0.081967213115,
        0.083791535146,
      ), 1,
      ),
    ],
    null,
    {},
  ),
  new ExtractedDataField(
    731,
    [
      new TableData(
        2,
        [{ y: 0 }, { y: 0.5217391304 }],
        [{ x: 0 }, { x: 0.368 }],
        [
          new Cell(0, 0, 'CODE', 1, 1, 2, 1),
          new Cell(0, 1, 'UNIT PRICE', 1, 1, 2, 1),
          new Cell(1, 0, 'ASDOD1', 1, 1, 2, 1),
          new Cell(1, 1, '', 1, 1, 2, 1),
        ],
        new Rect(0.5772, 0.45393374741200826, 0.20440000000000003, 0.07298136645962733),
        null,
        null,
        undefined,
        null,
        new SourceBboxCoordinates(null, 2, [new Rect(0.5772, 0.45393374741200826, 0.20440000000000003, 0.07298136645962733)]),
      ),
      new TableData(
        2,
        [{ y: 0 }, { y: 0.3125342768 }, { y: 0.645904172 }],
        [{ x: 0 }, { x: 0.3312236287 }],
        [
          new Cell(0, 0, 'QUANTITY 10', 2, 1, 2, 1),
          new Cell(0, 1, 'DESCRIFTION', 1, 1, 2, 1),
          new Cell(1, 1, 'Pack of Pencils', 1, 1, 2, 1),
          new Cell(2, 0, '', 1, 2, 2, 1),
        ],
        new Rect(0.1416, 0.4601449275362319, 0.3884, 0.1014492753623189),
        null,
        null,
        undefined,
        null,
        new SourceBboxCoordinates(null, 2, [new Rect(0.1416, 0.4601449275362319, 0.3884, 0.1014492753623189)]),
        null,
        null,
        null,
        'List-Tables-subField-2-id',
      ),
    ],
    null,
    { 'List-Tables-subField-2-id': 'List Tables subField-2 Alias' },
  ),
  new ExtractedDataField(
    732,
    [
      new DictFieldData(
        new FieldData(
          'WY 34582',
          new FieldCoordinates(
            1,
            0.133606557377,
            0.403047890575,
            0.104918032787,
            0.029698265621,
          ),
          1,
        ),
        new FieldData(
          'Same as recipient',
          new FieldCoordinates(
            1,
            0.324590163934,
            0.36380375386,
            0.127049180328,
            0.030758917965,
          ),
          1,
        ),
        'list-KV-subField-1-id',
      ),
      new DictFieldData(
        new FieldData(
          'an, NY',
          new FieldCoordinates(
            1,
            0.29262295082,
            0.121975019516,
            0.063114754098,
            0.051971964837,
          ),
          1,
        ),
        new FieldData(),
      ),
      new DictFieldData(
        new FieldData(),
        new FieldData(
          '2491839',
          new FieldCoordinates(
            2,
            0.253278688525,
            0.270466347622,
            0.104098360656,
            0.031819570309,
          ),
          1,
        ),
      ),
    ],
    null,
    { 'list-KV-subField-1-id': 'list KV subField-1 Alias' },
  ),
  new ExtractedDataField(
    733,
    [
      new DictFieldData(
        new FieldData(
          'INVOICE NO: 2491839',
          new FieldCoordinates(
            1,
            0.131967213115,
            0.256677867155,
            0.236885245902,
            0.050911312494,
          ),
          1,
        ),
        new FieldData(),
      ),
      new DictFieldData(
        new FieldData(
          'DATE: 24/06/2019',
          new FieldCoordinates(
            1,
            0.722950819672,
            0.254556562469,
            0.177049180328,
            0.064699792961,
          ),
          1,
        ),
        new FieldData(),
      ),
    ],
    null,
    {},
  ),
  new ExtractedDataField(
    734,
    [
      new DictFieldData(
        new FieldData(),
        new FieldData(
          'Fax (243) 758-5839',
          new FieldCoordinates(
            2,
            0.131967213115,
            0.214251773411,
            0.25,
            0.027576960934,
          ),
          1,
        ),
      ),
      new DictFieldData(
        new FieldData(),
        new FieldData(
          'INSTRUCTIONS Caorfirm before collection',
          new FieldCoordinates(
            2,
            0.509836065574,
            0.309710484336,
            0.164754098361,
            0.082730882802,
          ),
          1,
        ),
      ),
      new DictFieldData(
        new FieldData(),
        new FieldData(
          'INVOICE',
          new FieldCoordinates(
            2,
            0.490163934426,
            0.056214574212,
            0.193442622951,
            0.095458710926,
          ),
          1,
        ),
      ),
      new DictFieldData(
        new FieldData(),
        new FieldData(
          'DATE: 24/06/2019',
          new FieldCoordinates(
            2,
            0.720491803279,
            0.223797644503,
            0.193442622951,
            0.108186539049,
          ),
          1,
        ),
      ),
    ],
    null,
    {},
  ),
  new ExtractedDataField(
    777,
    [
      new FieldData(
        'firstOption',
        new FieldCoordinates(
          2,
          0.0237,
          0.2555,
          0.0581,
          0.0132,
        ),
        1,
      ),
      new FieldData(
        'secondOption',
        new FieldCoordinates(
          2,
          0.4604,
          0.2555,
          0.0745,
          0.0170,
        ),
        1,
      ),
    ],
    null,
    {},
  ),
]

const mockExtractedData1 = [
  new ExtractedDataField(
    740,
    new TableData(
      1,
      [{ y: 0 }],
      [{ x: 0 }],
      [new Cell(0, 0, '321', 1, 1, 1, 1)],
      new Rect(5, 6, 7, 8),
      null,
      null,
      undefined,
      null,
      new SourceBboxCoordinates(null, 1, [new Rect(5, 6, 7, 8)]),
    ),
  ),
  new ExtractedDataField(
    727,
    new DictFieldData(
      new FieldData(
        'TOTAL DUE AMOUNT',
        new FieldCoordinates(
          1,
          0.526229508197,
          0.696848589757,
          0.159836065574,
          0.033940874996,
        ),
        1,
      ),
      new FieldData(),
    ),
  ),
  new ExtractedDataField(
    725,
    new FieldData(
      'api data',
      new FieldCoordinates(
        1,
        0.47540983606,
        0.057275226555,
        0.147540983607,
        0.072124359366,
      ),
    ),
  ),
]

const mockExtractedData2 = [
  new ExtractedDataField(
    9999,
    new FieldData(
      true,
      [
        {
          page: 1,
          x: 0.1,
          y: 0.2,
          w: 0.3,
          h: 0.4,
        },
        {
          page: 1,
          x: 0.2,
          y: 0.4,
          w: 0.2,
          h: 0.4,
        },
      ],
      1,
    ),
  ),
  new ExtractedDataField(
    888,
    [
      new FieldData(
        true,
        [
          {
            page: 1,
            x: 0.1,
            y: 0.2,
            w: 0.3,
            h: 0.4,
          },
          {
            page: 1,
            x: 0.2,
            y: 0.4,
            w: 0.2,
            h: 0.4,
          },
        ],
        1,
      ),
      new FieldData(
        false,
        [
          {
            page: 1,
            x: 0.1,
            y: 0.2,
            w: 0.3,
            h: 0.4,
          },
          {
            page: 1,
            x: 0.2,
            y: 0.4,
            w: 0.2,
            h: 0.4,
          },
        ],
        1,
      ),
    ],
  ),
  new ExtractedDataField(
    666,
    new FieldData(
      'test',
      new FieldCoordinates(
        1,
        0.1,
        0.2,
        0.3,
        0.4,
      ),
      1,
    ),
  ),
  new ExtractedDataField(
    725,
    new FieldData(
      'INVOICE',
      [
        {
          page: 1,
          x: 0.475409836066,
          y: 0.057275226555,
          w: 0.147540983607,
          h: 0.072124359366,
        },
        {
          page: 1,
          x: 0.565409836066,
          y: 0.067275226555,
          w: 0.797540983607,
          h: 0.072124359366,
        },
      ],
      1,
    ),
  ),
  new ExtractedDataField(
    726,
    new DictFieldData(
      new FieldData(
        'AA Associates',
        new FieldCoordinates(
          1,
          0.135245901639,
          0.112429148423,
          0.132786885246,
          0.033940874996,
        ),
        1,
      ),
      new FieldData(
        'MY 352684',
        new FieldCoordinates(
          2,
          0.140983606557,
          0.166522417948,
          0.117213114754,
          0.028637613278,
        ),
        1,
      ),
    ),
  ),
  new ExtractedDataField(
    727,
    new DictFieldData(
      new FieldData(
        'TOTAL DUE AMOUNT',
        new FieldCoordinates(
          2,
          0.526229508197,
          0.696848589757,
          0.159836065574,
          0.033940874996,
        ),
        1,
      ),
      new FieldData(),
    ),
  ),
  new ExtractedDataField(
    728,
    new DictFieldData(
      new FieldData(),
      new FieldData(
        'AA Associates',
        new FieldCoordinates(
          2,
          0.122950819672,
          0.116671757798,
          0.137704918033,
          0.025455656247,
        ),
        1,
      ),
    ),
  ),
  new ExtractedDataField(
    729,
    new TableData(
      1,
      [{ y: 0 }, { y: 0.5205479452 }],
      [
        { x: 0 },
        { x: 0.5005393743 },
        { x: 0.836030205 },
      ],
      [
        new Cell(0, 0, '', 2, 1, 1, 1),
        new Cell(0, 1, 'SUBTOTAL 52,100.00', 1, 2, 1, 1),
        new Cell(1, 1, 'SALES TAX — 5%', 1, 1, 1, 1),
        new Cell(1, 2, '$105.00', 1, 1, 1, 1),
      ],
      new Rect(0.1448, 0.5926501035196687, 0.7596, 0.07712215320910976),
      null,
      null,
      undefined,
      null,
      new SourceBboxCoordinates(null, 1, [new Rect(0.1448, 0.5926501035196687, 0.7596, 0.07712215320910976)]),
    ),
    0,
  ),
  new ExtractedDataField(
    730,
    [
      new FieldData('Confirm before collaction', new FieldCoordinates(
        1,
        0.524590163934,
        0.364864406204,
        0.15,
        0.041365441401,
      ), 1,
      ),
      new FieldData('aaa', new FieldCoordinates(
        2,
        0.815573770492,
        0.118793062485,
        0.081967213115,
        0.083791535146,
      ), 1,
      ),
    ],
  ),
  new ExtractedDataField(
    731,
    [
      new TableData(
        2,
        [{ y: 0 }, { y: 0.5217391304 }],
        [{ x: 0 }, { x: 0.368 }],
        [
          new Cell(0, 0, 'CODE', 1, 1, 2, 1),
          new Cell(0, 1, 'UNIT PRICE', 1, 1, 2, 1),
          new Cell(1, 0, 'ASDOD1', 1, 1, 2, 1),
          new Cell(1, 1, '', 1, 1, 2, 1),
        ],
        new Rect(0.5772, 0.45393374741200826, 0.20440000000000003, 0.07298136645962733),
      ),
      new TableData(
        2,
        [{ y: 0 }, { y: 0.3125342768 }, { y: 0.645904172 }],
        [{ x: 0 }, { x: 0.3312236287 }],
        [
          new Cell(0, 0, 'QUANTITY 10', 2, 1, 2, 1),
          new Cell(0, 1, 'DESCRIFTION', 1, 1, 2, 1),
          new Cell(1, 1, 'Pack of Pencils', 1, 1, 2, 1),
          new Cell(2, 0, '', 1, 2, 2, 1),
        ],
        new Rect(0.1416, 0.4601449275362319, 0.3884, 0.1014492753623189),
        null,
        null,
        undefined,
        null,
        new SourceBboxCoordinates(
          null,
          2,
          new Rect(0.1416, 0.4601449275362319, 0.3884, 0.1014492753623189),
        ),
      ),
    ],
  ),
  new ExtractedDataField(
    732,
    [
      new DictFieldData(
        new FieldData(
          'WY 34582',
          new FieldCoordinates(
            1,
            0.133606557377,
            0.403047890575,
            0.104918032787,
            0.029698265621,
          ),
          1,
        ),
        new FieldData(
          'Same as recipient',
          new FieldCoordinates(
            1,
            0.324590163934,
            0.36380375386,
            0.127049180328,
            0.030758917965,
          ),
          1,
        ),
      ),
      new DictFieldData(
        new FieldData(
          'an, NY',
          new FieldCoordinates(
            1,
            0.29262295082,
            0.121975019516,
            0.063114754098,
            0.051971964837,
          ),
          1,
        ),
        new FieldData(),
      ),
      new DictFieldData(
        new FieldData(),
        new FieldData(
          '2491839',
          new FieldCoordinates(
            2,
            0.253278688525,
            0.270466347622,
            0.104098360656,
            0.031819570309,
          ),
          1,
        ),
      ),
    ],
  ),
  new ExtractedDataField(
    733,
    [
      new DictFieldData(
        new FieldData(
          'INVOICE NO: 2491839',
          new FieldCoordinates(
            1,
            0.131967213115,
            0.256677867155,
            0.236885245902,
            0.050911312494,
          ),
          1,
        ),
        new FieldData(),
      ),
      new DictFieldData(
        new FieldData(
          'DATE: 24/06/2019',
          new FieldCoordinates(
            1,
            0.722950819672,
            0.254556562469,
            0.177049180328,
            0.064699792961,
          ),
          1,
        ),
        new FieldData(),
      ),
    ],
  ),
  new ExtractedDataField(
    734,
    [
      new DictFieldData(
        new FieldData(),
        new FieldData(
          'Fax (243) 758-5839',
          new FieldCoordinates(
            2,
            0.131967213115,
            0.214251773411,
            0.25,
            0.027576960934,
          ),
          1,
        ),
      ),
      new DictFieldData(
        new FieldData(),
        new FieldData(
          'INSTRUCTIONS Caorfirm before collection',
          new FieldCoordinates(
            2,
            0.509836065574,
            0.309710484336,
            0.164754098361,
            0.082730882802,
          ),
          1,
        ),
      ),
      new DictFieldData(
        new FieldData(),
        new FieldData(
          'INVOICE',
          [
            {
              page: 2,
              x: 0.490163934426,
              y: 0.056214574212,
              w: 0.193442622951,
              h: 0.095458710926,
            },
            {
              page: 2,
              x: 0.495663934426,
              y: 0.156214574212,
              w: 0.783442622951,
              h: 0.095458710926,
            },
          ],
          1,
        ),
      ),
      new DictFieldData(
        new FieldData(),
        new FieldData(
          'DATE: 24/06/2019',
          [
            {
              page: 2,
              x: 0.720491803279,
              y: 0.223797644503,
              w: 0.193442622951,
              h: 0.108186539049,
            },
            {
              page: 2,
              x: 0.456491803279,
              y: 0.123797644503,
              w: 0.1567442622951,
              h: 0.9908186539049,
            },
          ],

          1,
        ),
      ),
    ],
  ),
]

export { mockExtractedData, mockExtractedData1, mockExtractedData2 }
