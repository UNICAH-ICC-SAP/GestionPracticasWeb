import { days, MODALS_TYPES, DOCUMENTS_TYPE, DOCUMENTS_ESTATE } from '../consts';

describe('consts', () => {
  it('days has 7 entries', () => {
    expect(days).toHaveLength(7);
  });

  it('MODALS_TYPES has expected keys', () => {
    expect(MODALS_TYPES.CREATE).toBe('create');
    expect(MODALS_TYPES.EDIT).toBe('edit');
  });

  it('DOCUMENTS_TYPE has expected keys', () => {
    expect(DOCUMENTS_TYPE.GENERALS).toBe('GENERALS');
  });

  it('DOCUMENTS_ESTATE has expected keys', () => {
    expect(DOCUMENTS_ESTATE.PENDING).toBe('pending');
  });
});
