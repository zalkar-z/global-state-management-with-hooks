import React, { ReactElement, createRef, useEffect } from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import useGlobal from '../../store';

import { has } from 'lodash';

import '../List/List.css'

interface Params {
  id?: string,
}
interface Props {
  show: boolean,
  onHide: Function,
  params: Params,
}

interface Check {
  title: string,
  isComplete: boolean,
}

const Card: React.FC<Props> = ({ show, onHide, params }) => {
  const [globalState, globalActions] = useGlobal();
  const { activeCard } = globalState;
  const { checklist } = activeCard;

  useEffect(() => {
    if(has(params, 'id')) {
      globalActions.lists.getLists();
      globalActions.cards.setActiveCard(params.id);
    }
  }, [params, globalActions]);

  const newChecklistItemInput: React.RefObject<HTMLInputElement> = createRef<HTMLInputElement>();

  function addChecklistItem(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (newChecklistItemInput.current === null) return;
    if (newChecklistItemInput.current.value.trim().length === 0) return;
    if (e.key !== 'Enter') return;

    const newChecklistItem = newChecklistItemInput.current.value;
    globalActions.cards.addChecklistItem(newChecklistItem);
    
    newChecklistItemInput.current.value = "";
  }

  const deleteCard = () => {
    globalActions.cards.deleteCard(activeCard.id);
    onHide();
  }

  return (
    <div>
      <Modal show={show} onHide={onHide} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>{activeCard.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            {checklist.map(
              (check: Check, index: number): ReactElement => {
                return (
                  <li key={index}>
                    <Row>
                      <Col md="1">
                        <Form>
                          <Form.Group controlId="todoCheckbox">
                            <Form.Check 
                              type="checkbox"
                              checked={check.isComplete}
                              onChange={(e: any) => globalActions.cards.updateChecklistItem(index, e.target.checked)} />
                          </Form.Group>
                        </Form>
                      </Col>
                      <Col style={{ textAlign: 'left' }}>
                        <span>{check.title}</span>
                      </Col>
                      <Col md="2">
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => globalActions.cards.deleteChecklistItem(index)}
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  </li>
                )
              }
            )}
          </ul>

          <div style={{ marginTop: '10px' }}>
            <input
              className="card-list-item"
              type="text"
              placeholder="Add a new task..."
              autoFocus
              ref={newChecklistItemInput}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => addChecklistItem(e)}
            />
          </div>
            
          <div style={{ marginTop: '10px', textAlign: 'right' }}>
            <Button size="sm" onClick={() => deleteCard()}>Delete this card</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
};

export default Card;
