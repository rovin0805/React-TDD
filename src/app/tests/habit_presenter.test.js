import HabitPresenter from '../habit_presenter';

describe('HabitPresenter', () => {
  const habits = [
    {
      id: 1,
      name: 'Reading',
      count: 1,
    },
    {
      id: 2,
      name: 'Running',
      count: 0,
    },
  ];
  let presenter;
  let update;
  const maxHabits = 3;

  beforeEach(() => {
    presenter = new HabitPresenter(habits, maxHabits);
    update = jest.fn();
  });

  it('inits with habits', () => {
    expect(presenter.getHabits()).toEqual(habits);
  });

  it('increments habit count and call update callback', () => {
    presenter.increment(habits[0], update);

    expect(presenter.getHabits()[0].count).toBe(2);
    checkUpdateIsCalled();
  });

  it('decrements habit count and call update callback', () => {
    presenter.decrement(habits[0], update);

    expect(presenter.getHabits()[0].count).toBe(0);
    checkUpdateIsCalled();
  });

  it('does not set the count value below 0 when decrements', () => {
    presenter.decrement(habits[0], update);
    presenter.decrement(habits[0], update);

    expect(presenter.getHabits()[0].count).toBe(0);
  });

  it('deletes habit from the list and call update callback', () => {
    presenter.delete(habits[0], update);

    expect(presenter.getHabits().length).toBe(1);
    expect(presenter.getHabits()[0].name).toBe('Running');
    checkUpdateIsCalled();
  });

  it('adds new habit to the list and call update callback', () => {
    const name = 'Eating';
    presenter.add(name, update);

    expect(presenter.getHabits()[2].name).toBe(name);
    expect(presenter.getHabits()[2].count).toBe(0);
    checkUpdateIsCalled();
  });

  it('throws an error when the max habits limit is exceeded', () => {
    presenter.add('Eating', update);
    expect(() => presenter.add('Eating', update)).toThrow(
      `The number of habits can't be more than ${maxHabits}.`
    );
  });

  describe('reset', () => {
    it('sets all habit counts to 0 and call update callback', () => {
      presenter.reset(update);

      expect(presenter.getHabits()[0].count).toBe(0);
      expect(presenter.getHabits()[1].count).toBe(0);
      checkUpdateIsCalled();
    });

    it('does not create new object when count is 0', () => {
      const habits = presenter.getHabits();
      presenter.reset(update);
      const updatedHabits = presenter.getHabits();

      expect(updatedHabits[1]).toBe(habits[1]);
    });
  });

  function checkUpdateIsCalled() {
    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(presenter.getHabits());
  }
});
